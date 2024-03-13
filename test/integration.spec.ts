import { spawn } from "child_process";
import expect from "expect";
import fse from "fs-extra";
import { searchRecursive } from "../src/utils";

const EXECUTABLE = "soufle-ts";

for (const dl of searchRecursive("test/samples/", (name) => name.endsWith(".dl"))) {
    describe(`Sample ${dl}`, () => {
        let exitCode: number | null;
        let stdOut = "";
        let expectedOut: string;
        let stdErr = "";

        beforeAll((done) => {
            const proc = spawn(EXECUTABLE, [dl]);
            expectedOut = fse.readFileSync(dl.slice(0, -2) + "out", { encoding: "utf-8" });

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
        describe(`Sample ${test}`, () => {
            let expectedOut: string;

            beforeAll(() => {
                expectedOut = fse.readFileSync(test.slice(0, -3) + ".out", { encoding: "utf-8" });
            });

            for (const mode of ["csv", "sqlite", "sqlite2csv"]) {
                it(`${mode} Instance works`, (done) => {
                    let stdOut = "";
                    let stdErr = "";

                    const proc = spawn(EXECUTABLE, [test, "--instance", "csv"]);

                    proc.stdout.on("data", (data) => {
                        stdOut += data.toString();
                    });

                    proc.stderr.on("data", (data) => {
                        stdErr += data.toString();
                    });

                    proc.on("exit", (code) => {
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
