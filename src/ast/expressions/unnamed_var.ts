import { Node, Src } from "../node";
import { Expression } from "./expression";

export class UnnamedVar extends Expression {
    constructor(src: Src) {
        super(src);
    }

    pp(): string {
        return "_";
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [];
    }

    copy(): this {
        return new UnnamedVar(this.src) as this;
    }
}
