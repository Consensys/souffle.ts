import { Node, Src } from "../node";
import { Type } from "../types";
import { Declaration } from "./declaration";

export class AliasType extends Declaration {
    constructor(
        public readonly name: string,
        public readonly originalType: Type,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.type ${this.name} = ${this.originalType.pp()}`;
    }

    children(): Iterable<Node> {
        return [this.originalType];
    }

    getStructId(): any {
        return [this.name, this.originalType];
    }
}
