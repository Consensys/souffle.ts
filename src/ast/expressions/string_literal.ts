import { Node, Src } from "../node";
import { Expression } from "./expression";

export class StringLiteral extends Expression {
    constructor(
        public readonly value: string,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `"${this.value}"`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.value];
    }
}
