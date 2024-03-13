import { Node, Src } from "../node";
import { Type } from "../types";
import { Declaration } from "./declaration";

export class UnionType extends Declaration {
    constructor(
        public readonly name: string,
        public readonly types: Type[],
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.type ${this.name} = ${this.types.map((x) => x.pp()).join(" | ")}`;
    }

    children(): Iterable<Node> {
        return this.types;
    }

    getStructId(): any {
        return [this.name, this.types];
    }
}
