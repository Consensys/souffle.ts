import { Node, Src } from "../node";
import { Declaration } from "./declaration";

export class Override extends Declaration {
    constructor(
        public readonly relation: string,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.override ${this.relation}`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.relation];
    }
}
