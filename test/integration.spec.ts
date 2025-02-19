import { spawn } from "child_process";
import expect from "expect";
import fse from "fs-extra";
import { assert, searchRecursive } from "../src/utils";

const EXECUTABLE = "souffle-ts";

const samples = searchRecursive("test/samples/", (name) => name.endsWith(".dl"));

for (const sample of samples) {
    describe(sample, () => {
        let exitCode: number | null;

        let expectedOut: string;
        let outputRelations: string[];

        let stdOut = "";
        let stdErr = "";

        before((done) => {
            expectedOut = fse.readFileSync(sample.slice(0, -2) + "out", { encoding: "utf-8" });
            const datalog = fse.readFileSync(sample, { encoding: "utf-8" });
            const firstLine = datalog.slice(0, datalog.indexOf("\n"));
            assert(
                firstLine.startsWith("//"),
                `Expected first line of start to be list of output relations`
            );

            outputRelations = firstLine.slice(2).trim().split(",");

            const proc = spawn(EXECUTABLE, [sample, "--output-relations", ...outputRelations]);

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
