import { join } from "path";
import os from "os";
import { open, Database } from "sqlite";
import { parse } from "csv-parse/sync";
import sqlite3 from "sqlite3";
import fse from "fs-extra";
import { Fact } from "./fact";
import { Relation } from "./relation";
import { assert } from "./utils";
import { spawnSync } from "child_process";

export type SouffleOutputType = "csv" | "sqlite";
export type FactMap = Map<string, Fact[]>;

export abstract class Result {
    protected _relationMap: Map<string, Relation>;
    constructor(public readonly relations: Relation[]) {
        this._relationMap = new Map(relations.map((r) => [r.name, r]));
    }

    relation(name: string): Relation {
        const res = this._relationMap.get(name);
        assert(res !== undefined, `Unknown relation ${name}`);

        return res;
    }

    abstract facts(name: string): Promise<Fact[]>;
    abstract allFacts(): Promise<FactMap>;
    abstract release(): void;
}

export class CSVResult extends Result {
    private _facts!: FactMap;
    constructor(
        relations: Relation[],
        private tmpDir: string
    ) {
        super(relations);
    }

    async allFacts(): Promise<FactMap> {
        if (this._facts == undefined) {
            this._facts = this.readProducedCsvFiles();
        }

        return this._facts;
    }

    async facts(name: string): Promise<Fact[]> {
        const fm = await this.allFacts();
        const res = fm.get(name);

        assert(res !== undefined, ``);
        return res;
    }

    protected readProducedCsvFiles(): FactMap {
        const res: FactMap = new Map();

        for (const relation of this.relations) {
            const fileName = join(this.tmpDir, relation.name + ".csv");

            const content = fse.readFileSync(fileName, { encoding: "utf-8" });
            const entries = this.parseCsv(content);

            res.set(relation.name, Fact.fromCSVRows(relation, entries));
        }

        return res;
    }

    private parseCsv(content: string, delimiter = ","): string[][] {
        const config = {
            skipEmptyLines: true,
            cast: false,
            delimiter
        };

        return parse(content, config);
    }

    release(): void {
        fse.rmSync(this.tmpDir, { recursive: true });
    }
}

export class SQLResult extends Result {
    private _db!: Database;

    constructor(
        relations: Relation[],
        private tmpDir: string,
        private dbFile: string
    ) {
        super(relations);
    }

    async db(): Promise<Database> {
        if (this._db === undefined) {
            this._db = await open({
                filename: this.dbFile,
                driver: sqlite3.Database
            });
        }

        return this._db;
    }

    async facts(name: string): Promise<Fact[]> {
        const r = this._relationMap.get(name);
        const db = await this.db();
        assert(r !== undefined, `Uknown relation ${name}`);

        const rawRes = await db.all(`SELECT * from ${name}`);

        return Fact.fromSQLRows(r, rawRes);
    }

    async allFacts(): Promise<FactMap> {
        const res: FactMap = new Map();
        const db = await this.db();

        for (const reln of this.relations) {
            const rawRes = await db.all(`SELECT * from ${reln.name}`);

            res.set(reln.name, Fact.fromSQLRows(reln, rawRes));
        }

        return res;
    }

    release(): void {
        fse.rmSync(this.dbFile);
        fse.rmSync(this.tmpDir, { recursive: true });
    }
}

/**
 * Given some datalog *without* output directives, and a list of `Relation`s that we want as output:
 *  1. Add the neccessary output directives for the required relations
 *  2. Run souffle
 *  3. Parse and return the results as a `Result` object.
 *
 * Note: The Result object may maintain reference to some on-disk resources (temp files). To free
 * those resources call Result.release()
 */
export async function run(
    datalog: string,
    outputRelations: Relation[],
    type: SouffleOutputType,
    soDir?: string
): Promise<Result> {
    const sysTmpDir = os.tmpdir();
    const tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));

    const inputFile = join(tmpDir, "input.dl");

    const outputDirectives = outputRelations.map((reln) =>
        type === "csv"
            ? `.output ${reln.name}(rfc4180=true)`
            : `.output ${reln.name}(IO=sqlite, dbname="output.sqlite")`
    );

    const outputFiles =
        type === "csv"
            ? outputRelations.map((reln) => join(tmpDir, `${reln.name}.csv`))
            : [join(tmpDir, "output.sqlite")];

    const finalDL = datalog + "\n" + outputDirectives.join("\n");

    fse.writeFileSync(inputFile, finalDL, {
        encoding: "utf-8"
    });

    const args = ["--wno", "all", "-D", tmpDir];

    if (soDir !== undefined) {
        args.push(`-L${soDir}`);
    }

    args.push(inputFile);

    const result = spawnSync("souffle", args, {
        encoding: "utf-8"
    });

    if (result.status !== 0) {
        throw new Error(
            `Souffle terminated with non-zero exit code (${result.status}): ${result.stderr}`
        );
    }

    if (type === "csv") {
        return new CSVResult(outputRelations, tmpDir);
    } else {
        return new SQLResult(outputRelations, tmpDir, outputFiles[0]);
    }
}
