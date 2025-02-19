import { basename, join } from "path";
import { parse } from "csv-parse/sync";
import { spawnSync } from "child_process";
import { Fact } from "./fact";
import { getRelations, Relation } from "./relation";
import { assert, searchRecursive } from "./utils";
import fse from "fs-extra";
import os from "os";
import { parseProgram } from "./parser";
import { TypeEnv } from "./types";

type FactMap = Map<string, Fact[]>;

export abstract class SouffleResult {
    abstract relations(): Iterable<Relation>;
    abstract relation(name: string): Relation;
    abstract facts(name: string): Promise<Fact[]>;
    abstract allFacts(): Promise<FactMap>;
}

class SouffleCSVResult extends SouffleResult {
    private relationMap: Map<string, Relation>;
    constructor(
        private _relations: Relation[],
        private _facts: FactMap
    ) {
        super();
        this.relationMap = new Map(this._relations.map((r) => [r.name, r]));
    }

    relations(): Iterable<Relation> {
        return this._relations;
    }

    relation(name: string): Relation {
        const res = this.relationMap.get(name);
        assert(res !== undefined, `Unknown relation ${name}`);
        return res;
    }

    async allFacts(): Promise<FactMap> {
        return this._facts;
    }

    async facts(name: string): Promise<Fact[]> {
        const res = this._facts.get(name);
        assert(res !== undefined, `Unknown relation ${name}`);
        return res;
    }
}

function parseCsv(content: string, delimiter = ","): string[][] {
    const config = {
        skipEmptyLines: true,
        cast: false,
        delimiter
    };

    return parse(content, config);
}

type RelationsMap = Map<string, Relation>;

/**
 * Read all csv files in the given `csvDir` and convert the to `Fact` objects.
 * This requires looking up the relation corresponding to each file in `relnMap`.
 * Returns map from relation names to an array of facts for that relation
 */
function getFactsFromCSVFiles(csvDir: string, relnMap: RelationsMap): FactMap {
    const facts: FactMap = new Map();
    const outputFiles = searchRecursive(csvDir, (x) => x.endsWith(".csv"));

    for (const fileName of outputFiles) {
        const relName = basename(fileName, ".csv");
        const relation = relnMap.get(relName);
        assert(relation !== undefined, `No relation for output file ${relName}.csv`);

        const content = fse.readFileSync(fileName, { encoding: "utf-8" });
        const entries = parseCsv(content);

        facts.set(relName, Fact.fromCSVRows(relation, entries));
    }

    return facts;
}

/**
 * Equivalent ot `souffle --show=transformed-datalog`
 * Instantiates all components, prune relations not needed for .output directives
 */
async function transformDatalog(datalog: string): Promise<string> {
    const sysTmpDir = os.tmpdir();
    const tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));
    const inputFile = join(tmpDir, "input.dl");
    fse.writeFileSync(inputFile, datalog, {
        encoding: "utf-8"
    });

    const result = spawnSync("souffle", ["--show=transformed-datalog", inputFile], {
        encoding: "utf-8",
        maxBuffer: 32 * 1024 * 1024
    });

    fse.rmSync(tmpDir, { recursive: true });

    if (result.status !== 0) {
        throw new Error(
            `Souffle datalog transformation terminated with non-zero exit code (${result.status}): ${result.stderr}`
        );
    }

    return result.stdout;
}

/**
 * Need to strip .output from transformed datalog due to
 * https://github.com/souffle-lang/souffle/issues/2531
 */
function stripOutputDirectives(datalog: string): string {
    return datalog
        .split("\n")
        .filter((line) => !line.startsWith(".output"))
        .join("\n");
}

export async function runCSV(
    datalog: string,
    outputRelationNames: string[],
    soDir?: string
): Promise<SouffleCSVResult> {
    datalog += "\n" + outputRelationNames.map((reln) => `.output ${reln}(rfc4180=true)`).join("\n");
    const transformedDatalog = stripOutputDirectives(await transformDatalog(datalog));

    const sysTmpDir = os.tmpdir();
    const tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));
    const inputFile = join(tmpDir, "input.dl");

    fse.writeFileSync(inputFile, datalog, {
        encoding: "utf-8"
    });

    const program = parseProgram(transformedDatalog);
    const env = TypeEnv.buildTypeEnv(program);
    const outputRelations = getRelations(program, env);
    const outputRelationsMap = new Map(outputRelations.map((r) => [r.name, r]));

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

    const facts = getFactsFromCSVFiles(tmpDir, outputRelationsMap);

    fse.rmSync(tmpDir, { recursive: true });
    return new SouffleCSVResult(outputRelations, facts);
}
