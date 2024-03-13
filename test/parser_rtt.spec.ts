import expect from "expect";
import fse from "fs-extra";
import { searchRecursive } from "../src";
import { Program } from "../src/ast";
import { parseProgram } from "../src/parser";

function ppProg(p: Program): string {
    return p.map((n) => n.pp()).join("\n");
}

describe(`Parse Round-trip tests`, () => {
    for (const dl of searchRecursive("test/samples/", (name) => name.endsWith(".dl"))) {
        describe(`Sample ${dl}`, () => {
            let contents: string;
            let prog: Program;
            let output: string;
            let reParsedProg: Program;

            beforeAll(() => {
                contents = fse.readFileSync(dl, { encoding: "utf-8" });
            });

            it("Parses correctly", () => {
                expect(() => {
                    prog = parseProgram(contents);
                }).not.toThrow();
            });

            it("Re-parses after outputting correctly", () => {
                expect(() => {
                    output = ppProg(prog);
                    // Uncomment below line to save intermediate output
                    // fse.writeFileSync(dl.slice(0, -3) + ".tmp", output);
                    reParsedProg = parseProgram(output);
                }).not.toThrow();
            });

            it("Produces an equivalent AST to the original", () => {
                expect(output).toEqual(ppProg(reParsedProg));
            });
        });
    }
});
