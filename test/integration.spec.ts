import { spawn } from "child_process";
import expect from "expect";
import fse from "fs-extra";
import { searchRecursive } from "../src/utils";

const EXECUTABLE = "souffle-ts";

const samples = searchRecursive("test/samples/", (name) => name.endsWith(".dl"));

for (const sample of samples) {
    describe(sample, () => {
        let exitCode: number | null;

        let expectedOut: string;

        let stdOut = "";
        let stdErr = "";

        before((done) => {
            const proc = spawn(EXECUTABLE, [sample]);

            expectedOut = fse.readFileSync(sample.slice(0, -2) + "out", { encoding: "utf-8" });

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
            expect(exitCode).toEqual(0);
        });

        it("stdOut is correct", () => {
            expect(stdOut).toEqual(expectedOut);
        });

        it("stdErr is correct", () => {
            expect(stdErr).toEqual("");
        });
    });
}

const TRIPPLE_TESTS = ["test/samples/large.dl"];

describe(`Instances produce the same output`, () => {
    for (const test of TRIPPLE_TESTS) {
        describe(test, () => {
            let expectedOut: string;

            before(() => {
                expectedOut = fse.readFileSync(test.slice(0, -3) + ".out", { encoding: "utf-8" });
            });

            for (const mode of ["csv", "sqlite", "csv2sqlite"]) {
                it(`${mode} instance works`, (done) => {
                    let stdOut = "";
                    let stdErr = "";

                    const proc = spawn(EXECUTABLE, [test, "--instance", mode]);

                    proc.stdout.on("data", (data) => {
                        stdOut += data.toString();
                    });

                    proc.stderr.on("data", (data) => {
                        stdErr += data.toString();
                    });

                    proc.on("exit", (code) => {
                        if (
                            mode === "sqlite" &&
                            stdErr.startsWith("WARNING: SouffleSQLiteInstance doesn")
                        ) {
                            stdErr = stdErr.slice(132);
                        }

                        expect(stdErr.trimEnd()).toEqual("");
                        expect(code).toEqual(0);
                        expect(stdOut.trimEnd()).toEqual(expectedOut);

                        done();
                    });
                });
            }
        });
    }
});
