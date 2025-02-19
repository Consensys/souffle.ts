import { Logical, Term } from ".";
import { Node, Src } from "../../node";

export class Conjunction extends Logical {
    constructor(
        public readonly conjuncts: Term[],
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return this.conjuncts.map((x) => x.pp()).join(", ");
    }

    children(): Iterable<Node> {
        return this.conjuncts;
    }

    getStructId(): any {
        return this.conjuncts;
    }

    copy(): this {
        return new Conjunction(
            this.conjuncts.map((c) => c.copy()),
            this.src
        ) as this;
    }
}
