#!/usr/bin/env node
import { Command } from "commander";
import fse from "fs-extra";
import { SouffleCSVInstance, SouffleInstance, SouffleSQLiteInstance } from "../instance";
import { parseProgram } from "../parser";

const pkg = require("../../package.json");

async function main() {
    const program = new Command();

    program
        .name("souffle-ts")
        .description(pkg.description)
        .version(pkg.version, "-v, --version", "Print package version")
        .helpOption("-h, --help", "Print help message");

    program.argument("[file(s)]", "Either one or more Datalog files");

    program
        .option("--stdin", "Read input from STDIN instead of files")
        .option("--parse", "Print AST of parsed Datalog source and exit")
        .option("--instance <type>", "Type of instance - one of csv, sqlite", "csv");

    program.parse(process.argv);

    const fileNames = program.args;
    const options = program.opts();

    if (options.help || (fileNames.length === 0 && !options.stdin)) {
        console.log(program.helpInformation());

        return;
    }

    const fileMap = new Map<string, string>();

    if (options.stdin) {
        fileMap.set("stdin", await fse.readFile(process.stdin.fd, { encoding: "utf-8" }));
    } else {
        const contents = await Promise.all(
            fileNames.map((fileName) => fse.readFile(fileName, { encoding: "utf-8" }))
        );

        for (let i = 0; i < fileNames.length; i++) {
            fileMap.set(fileNames[i], contents[i]);
        }
    }

    const dl = [...fileMap.values()].join("\n");

    if (options.parse) {
        const ast = parseProgram(dl);

        /**
         * @todo Introduce JSON AST
         */
        console.log(ast);

        return;
    }

    let instance: SouffleInstance;

    if (options.instance === "csv") {
        instance = new SouffleCSVInstance(dl);
    } else if (options.instance === "sqlite") {
        instance = new SouffleSQLiteInstance(dl);
    } else {
        throw new Error(`Unknown instance type ${options.instance}`);
    }

    const relations = [...instance.relations()];

    await instance.run(relations.map((reln) => reln.name));

    const res = await instance.allFacts();
    const orderedRelns = [...res.entries()];
    orderedRelns.sort(([reln1], [reln2]) => (reln1 < reln2 ? -1 : reln1 === reln2 ? 0 : 1));

    for (const [relnName, facts] of orderedRelns) {
        const rel = instance.relation(relnName);

        console.log(`/// ${relnName}`);
        console.log("===============");
        console.log(rel.fields.map(([field]) => field).join(" "));

        for (const fact of facts) {
            console.log(fact.toCSVRow().join("    "));
        }
    }

    instance.release();
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(e.message);

        process.exit(1);
    });
