import { Logical } from ".";
import { Node, Src } from "../../node";
import { Conjunction } from "./conjunction";

export class Disjunction extends Logical {
    constructor(
        public readonly conjuncts: Conjunction[],
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `(` + this.conjuncts.map((x) => x.pp()).join("; ") + `)`;
    }

    children(): Iterable<Node> {
        return this.conjuncts;
    }

    getStructId(): any {
        return this.conjuncts;
    }
}
