import { Node, Src } from "../../node";
import { Logical, Term } from ".";

export class Negation extends Logical {
    constructor(
        public readonly inner: Term,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `!${this.inner.pp()}`;
    }

    children(): Iterable<Node> {
        return [this.inner];
    }

    getStructId(): any {
        return [this.inner];
    }

    copy(): this {
        return new Negation(this.inner.copy(), this.src) as this;
    }
}
