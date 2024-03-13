import { Node, Src } from "../node";
import { Atom } from "../rules";
import { Declaration } from "./declaration";

export class Fact extends Declaration {
    constructor(
        public readonly atom: Atom,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}${this.atom.pp()}.`;
    }

    children(): Iterable<Node> {
        return [this.atom];
    }

    getStructId(): any {
        return this.atom.getStructId();
    }
}
