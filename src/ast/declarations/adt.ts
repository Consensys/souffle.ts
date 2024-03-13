import { flatten } from "../../utils";
import { Node, Src } from "../node";
import { Type } from "../types";
import { Declaration } from "./declaration";

export class AlgebraicDataType extends Declaration {
    constructor(
        public readonly name: string,
        public readonly branches: Array<[string, Array<[string, Type]>]>,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.type ${this.name} = ${this.branches
            .map((b) => `${b[0]} {${b[1].map((f) => `${f[0]}: ${f[1].pp()}`).join(", ")}}`)
            .join(" | ")}`;
    }

    children(): Iterable<Node> {
        return flatten(this.branches.map((b) => b[1].map((a) => a[1])));
    }

    getStructId(): any {
        return [this.name, this.branches];
    }
}
