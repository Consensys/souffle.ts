#!/usr/bin/env node
import { Command } from "commander";
import fse from "fs-extra";

const pkg = require("../../package.json");

async function main() {
    const program = new Command();

    program
        .name("soufle-ts")
        .description(pkg.description)
        .version(pkg.version, "-v, --version", "Print package version")
        .helpOption("-h, --help", "Print help message");

    program.argument("[file(s)]", "Either one or more Datalog files");

    program
        .option("--stdin", "Read input from STDIN instead of files")
        .option("--from-ast", "Treat an input as JSON AST")
        .option("--ast", "Print JSON AST")
        .option("--print", "Print Datalog source");

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

    if (options.fromAst) {
        /**
         * @todo Implement treating an input as JSON AST
         */
    }

    if (options.ast) {
        console.log("<JSON AST>");

        return;
    }

    if (options.print) {
        console.log("<SOURCE>");

        return;
    }

    throw new Error("Provide one of output options");
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((e) => {
        console.error(e.message);

        process.exit(1);
    });
