import expect from "expect";
import os from "os";
import { join } from "path";
import fse from "fs-extra";
import { Relation, Fact, CSVFactSet, SQLFactSet, NumberT, SymbolT, SubT, RecordT } from "../src";

const EdgeR = new Relation("edge", [
    ["_from", NumberT],
    ["_to", NumberT]
]);

const LabelR = new Relation("label", [["lbl", SymbolT]]);

const IdT = new SubT("IdT", NumberT);
const IdR = new Relation("IdLbl", [
    ["id", IdT],
    ["lbl", SymbolT]
]);

const PathT = new RecordT("PathT", []);
PathT.fields = [
    ["head", IdT],
    ["tail", PathT]
];
const HasPathR = new Relation("HasPath", [
    ["_from", IdT],
    ["_to", IdT],
    ["path", PathT]
]);

const samples: Array<[Relation, Fact[]]> = [
    [
        EdgeR,
        Fact.fromCSVRows(EdgeR, [
            ["0", "1"],
            ["1", "2"],
            ["2", "3"]
        ])
    ],
    [LabelR, Fact.fromCSVRows(LabelR, [["a"], ["b"], ["c"]])],
    [IdR, [new Fact(IdR, [1, "foo"]), new Fact(IdR, [2, "bar"])]],
    [
        HasPathR,
        [
            new Fact(HasPathR, [
                1,
                2,
                { head: 1, tail: { head: 3, tail: { head: 2, tail: null } } }
            ]),
            new Fact(HasPathR, [3, 4, null])
        ]
    ]
];

describe(`Fact Set RTT`, () => {
    for (const factSetType of [CSVFactSet, SQLFactSet])
        it(`Fact set ${factSetType.name} can dump and load relations`, async () => {
            const sysTmpDir = os.tmpdir();
            const tmpDir = await fse.mkdtempSync(join(sysTmpDir, "sol-datalog-"));

            for (const [reln, facts] of samples) {
                const factSet = new factSetType([reln], tmpDir);

                factSet.addFacts(...facts);

                await factSet.persist();

                const newFactSet = new factSetType([reln], tmpDir);

                const readFacts = await newFactSet.facts(reln.name);

                expect(facts.length).toEqual(readFacts.length);
                for (let i = 0; i < facts.length; i++) {
                    expect(facts[i].pp()).toEqual(readFacts[i].pp());
                }
            }
        });
});
