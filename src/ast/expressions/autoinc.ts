import { Node, Src } from "../node";
import { Expression } from "./expression";

export class AutoIncrement extends Expression {
    constructor(src: Src) {
        super(src);
    }

    pp(): string {
        return "autoinc()";
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [];
    }

    copy(): this {
        return new AutoIncrement(this.src) as this;
    }
}
