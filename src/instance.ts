import { spawnSync } from "child_process";
import fse from "fs-extra";
import os from "os";
import { basename, join } from "path";
import { assert, searchRecursive } from "./utils";
import { parse } from "csv-parse/sync";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { RecordT, TypeEnv, ADTT } from "./types";
import { Relation, getRelations } from "./relation";
import { Fact } from "./fact";
import * as ast from "./ast";
import { parseProgram } from "./parser";

export type SouffleOutputType = "csv" | "sqlite";
export type OutputRelations = Map<string, Fact[]>;

export interface SouffleInstanceI {
    run(outputRelations: string[]): Promise<void>;
    release(): void;
    relation(name: string): Relation;
    relations(): Iterable<Relation>;
    relationFacts(name: string): Promise<Fact[]>;
    allFacts(): Promise<OutputRelations>;
}

export interface SouffleSQLInstanceI extends SouffleInstanceI {
    getSQL(sql: string): Promise<any[]>;
    dbName(): string;
}

export abstract class SouffleInstance implements SouffleInstanceI {
    protected tmpDir!: string;
    protected inputFile!: string;
    protected outputFiles!: string[];
    protected success: boolean;

    protected env: TypeEnv;
    protected _relations: Map<string, Relation>;
    protected soDir: string | undefined;
    protected program: ast.Program;

    constructor(
        private readonly datalog: string,
        private readonly outputRelationsMode: SouffleOutputType,
        soDir?: string
    ) {
        this.success = false;

        this.program = parseProgram(this.datalog);
        this.env = TypeEnv.buildTypeEnv(this.program);
        this._relations = new Map(getRelations(this.program, this.env).map((r) => [r.name, r]));

        this.soDir = soDir;
    }

    async run(outputRelations: string[]): Promise<void> {
        const sysTmpDir = os.tmpdir();
        this.tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));

        this.inputFile = join(this.tmpDir, "input.dl");

        const outputDirectives = outputRelations.map((reln) =>
            this.outputRelationsMode === "csv"
                ? `.output ${reln}(rfc4180=true)`
                : `.output ${reln}(IO=sqlite, dbname="output.sqlite")`
        );

        this.outputFiles =
            this.outputRelationsMode === "csv"
                ? outputRelations.map((reln) => join(this.tmpDir, `${reln}.csv`))
                : [join(this.tmpDir, "output.sqlite")];

        const finalDL = this.datalog + "\n" + outputDirectives.join("\n");

        fse.writeFileSync(this.inputFile, finalDL, {
            encoding: "utf-8"
        });

        const args = ["--wno", "all", "-D", this.tmpDir];

        if (this.soDir !== undefined) {
            args.push(`-L${this.soDir}`);
        }

        args.push(this.inputFile);

        const result = spawnSync("souffle", args, {
            encoding: "utf-8"
        });

        if (result.status !== 0) {
            throw new Error(
                `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}`
            );
        }

        this.success = true;
    }

    release(): void {
        fse.removeSync(this.inputFile);

        for (const f of this.outputFiles) {
            fse.removeSync(f);
        }

        fse.rmdirSync(this.tmpDir);
    }

    relations(): Iterable<Relation> {
        return this._relations.values();
    }

    relation(name: string): Relation {
        const res = this._relations.get(name);

        assert(res !== undefined, `Unknown relation ${name}`);

        return res;
    }

    abstract relationFacts(name: string): Promise<Fact[]>;
    abstract allFacts(): Promise<OutputRelations>;
}

export class SouffleCSVInstance extends SouffleInstance {
    private _results: OutputRelations | undefined;

    constructor(datalog: string, soDir?: string) {
        super(datalog, "csv", soDir);
    }

    async allFacts(): Promise<OutputRelations> {
        assert(this.success, `Instance not run yet`);

        if (!this._results) {
            this._results = this.readProducedCsvFiles();
        }

        return this._results;
    }

    async relationFacts(name: string): Promise<Fact[]> {
        const res = await this.allFacts();
        const facts = res.get(name);

        assert(facts !== undefined, `Unknown relation ${name}`);

        return facts;
    }

    private parseCsv(content: string, delimiter = ","): string[][] {
        const config = {
            skipEmptyLines: true,
            cast: false,
            delimiter
        };

        return parse(content, config);
    }

    protected readProducedCsvFiles(): OutputRelations {
        const relMap: OutputRelations = new Map();
        const outputFiles = searchRecursive(this.tmpDir, (x) => x.endsWith(".csv"));

        for (const fileName of outputFiles) {
            const relName = basename(fileName, ".csv");
            const relation = this.relation(relName);

            const content = fse.readFileSync(fileName, { encoding: "utf-8" });
            const entries = this.parseCsv(content);

            relMap.set(relName, Fact.fromCSVRows(relation, entries));
        }

        return relMap;
    }
}

/**
 * For now this instance is not to be used due to https://github.com/souffle-lang/souffle/issues/2457
 */
export class SouffleSQLiteInstance extends SouffleInstance implements SouffleSQLInstanceI {
    private db!: Database;

    constructor(datalog: string, soDir?: string) {
        super(datalog, "sqlite", soDir);

        // Issue a warning if we try to use this on DL with unsupported types
        for (const typ of this.env.types()) {
            if (typ instanceof RecordT || typ instanceof ADTT) {
                console.error(
                    `WARNING: SouffleSQLiteInstance doesn't fully support Record and ADT types due to https://github.com/souffle-lang/souffle/issues/2457`
                );
            }
        }
    }

    async run(outputRelations: string[]): Promise<void> {
        await super.run(outputRelations);

        this.db = await open({
            filename: this.outputFiles[0],
            driver: sqlite3.Database
        });
    }

    dbName(): string {
        return this.outputFiles[0];
    }

    async relationFacts(name: string): Promise<Fact[]> {
        const r = this._relations.get(name);
        assert(r !== undefined, `Uknown relation ${name}`);

        const rawRes = await this.db.all(`SELECT * from ${name}`);

        return Fact.fromSQLRows(r, rawRes);
    }

    async getSQL(sql: string): Promise<any[]> {
        return await this.db.all(sql);
    }

    async allFacts(): Promise<OutputRelations> {
        assert(this.success, `Instance not run yet`);
        const res: OutputRelations = new Map();

        for (const reln of this._relations.values()) {
            const rawRes = await this.db.all(`SELECT * from ${reln.name}`);

            res.set(reln.name, Fact.fromSQLRows(reln, rawRes));
        }

        return res;
    }
}
