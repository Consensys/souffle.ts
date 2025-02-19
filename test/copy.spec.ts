import expect from "expect";
import fse from "fs-extra";
import { Program } from "../src/ast";
import { parseProgram } from "../src/parser";

function ppProg(p: Program): string {
    return p.map((n) => n.pp()).join("\n");
}

describe(`Copy test`, () => {
    for (const dl of ["test/samples/all_nodes.dl"]) {
        describe(dl, () => {
            let contents: string;

            before(() => {
                contents = fse.readFileSync(dl, { encoding: "utf-8" });
            });

            it("Copy produces equivalent program", () => {
                const prog = parseProgram(contents);
                const copyProg = prog.map((p) => p.copy());

                const progText = ppProg(prog);
                const copyText = ppProg(copyProg);

                expect(progText).toEqual(copyText);
            });
        });
    }
});
