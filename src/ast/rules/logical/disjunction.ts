import { Logical } from ".";
import { Node, Src } from "../../node";
import { Conjunction } from "./conjunction";

export class Disjunction extends Logical {
    constructor(
        public readonly disjuncts: Conjunction[],
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `(` + this.disjuncts.map((x) => x.pp()).join("; ") + `)`;
    }

    children(): Iterable<Node> {
        return this.disjuncts;
    }

    getStructId(): any {
        return this.disjuncts;
    }

    copy(): this {
        return new Disjunction(
            this.disjuncts.map((c) => c.copy()),
            this.src
        ) as this;
    }
}
