import { spawn } from "child_process";
import expect from "expect";
import fse from "fs-extra";

const EXECUTABLE = "soufle-ts";

const HELP_MESSAGE = `Usage: soufle-ts [options] [file(s)]

Wrapper library around the Souffle Datalog Language

Arguments:
  file(s)        Either one or more Datalog files

Options:
  -v, --version  Print package version
  --stdin        Read input from STDIN instead of files
  --from-ast     Treat an input as JSON AST
  --ast          Print JSON AST
  --print        Print Datalog source
  -h, --help     Print help message`;

const cases: Array<
    [string[], string | undefined, number, string | RegExp | undefined, string | RegExp | undefined]
> = [
    [["--version"], undefined, 0, /^\d+\.\d+\.\d+$/, undefined],
    [["--help"], undefined, 0, HELP_MESSAGE, undefined],
    [["test/samples/example.dl"], undefined, 1, undefined, "Provide one of output options"],
    [["--print"], undefined, 0, HELP_MESSAGE, undefined],
    [["test/samples/example.dl", "--print"], undefined, 0, "<SOURCE>", undefined],
    [
        ["test/samples/example.dl", "--ast"],
        undefined,
        0,
        sample("test/samples/example.ast.json"),
        undefined
    ],
    [
        ["path/to/nowhere"],
        undefined,
        1,
        undefined,
        "ENOENT: no such file or directory, open 'path/to/nowhere'"
    ]
];

function sample(fileName: string): string {
    return fse.readFileSync(fileName, { encoding: "utf-8" }).trimEnd();
}

function composeCommand(params: string[], stdIn?: string): string {
    let command = EXECUTABLE;

    if (params.length) {
        command += " " + params.join(" ");
    }

    if (stdIn === undefined) {
        return command;
    }

    return "echo '" + stdIn + "' | " + command;
}

for (const [args, stdIn, expectedExitCode, expectedStdOut, expectedStdErr] of cases) {
    describe(composeCommand(args, stdIn), () => {
        let exitCode: number | null;
        let stdOut = "";
        let stdErr = "";

        beforeAll((done) => {
            const proc = spawn(EXECUTABLE, args);

            if (stdIn) {
                proc.stdin.end(stdIn);
            }

            proc.stdout.on("data", (data) => {
                stdOut += data.toString();
            });

            proc.stderr.on("data", (data) => {
                stdErr += data.toString();
            });

            proc.on("exit", (code) => {
                exitCode = code;

                stdOut = stdOut.trimEnd();
                stdErr = stdErr.trimEnd();

                done();
            });
        });

        it("exitCode is correct", () => {
            expect(exitCode).toEqual(expectedExitCode);
        });

        it("stdOut is correct", () => {
            if (expectedStdOut === undefined) {
                expect(stdOut).toEqual("");
            } else if (expectedStdOut instanceof RegExp) {
                expect(stdOut).toMatch(expectedStdOut);
            } else {
                expect(stdOut).toEqual(expectedStdOut);
            }
        });

        it("stdErr is correct", () => {
            if (expectedStdErr === undefined) {
                expect(stdErr).toEqual("");
            } else if (expectedStdErr instanceof RegExp) {
                expect(stdErr).toMatch(expectedStdErr);
            } else {
                expect(stdErr).toEqual(expectedStdErr);
            }
        });
    });
}
