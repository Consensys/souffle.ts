import { Node, Src } from "../node";
import { Expression } from "./expression";

export class Nil extends Expression {
    constructor(src: Src) {
        super(src);
    }

    pp(): string {
        return `nil`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [];
    }

    copy(): this {
        return new Nil(this.src) as this;
    }
}
