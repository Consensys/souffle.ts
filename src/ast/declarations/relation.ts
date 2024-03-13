import { Node, Src } from "../node";
import { Type } from "../types";
import { Declaration } from "./declaration";

export enum RelationTags {
    Overridable = "overridable",
    Inline = "inline",
    NoInline = "no_inline",
    Magic = "magic",
    NoMagic = "no_magic",
    Brie = "brie",
    BTree = "btree",
    BTreeDelete = "btree_delete",
    EQRel = "eqrel"
}

export type RelationChoiceDomain = string | string[];

export class Relation extends Declaration {
    constructor(
        public readonly name: string,
        public readonly args: Array<[string, Type]>,
        public readonly tags: Set<RelationTags>,
        public readonly choiceDomains: RelationChoiceDomain[],
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        const choiceStrs = [];

        for (const x of this.choiceDomains) {
            if (typeof x === "string") {
                choiceStrs.push(x);
            } else {
                choiceStrs.push(`(${x.join(", ")})`);
            }
        }

        return `${indent}.decl ${this.name}(${this.args
            .map((a) => `${a[0]}: ${a[1].pp()}`)
            .join(", ")}) ${[...this.tags].join(" ") + " "}${
            choiceStrs.length > 0 ? `choice-domain ${choiceStrs.join(", ")}` : ""
        }`;
    }

    children(): Iterable<Node> {
        return [...this.args.map((x) => x[1])];
    }

    getStructId(): any {
        const tags = [...this.tags];
        tags.sort();
        return [this.name, this.args, tags, this.choiceDomains];
    }
}
