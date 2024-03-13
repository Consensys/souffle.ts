import { Node, Src } from "../node";
import { Expression } from "./expression";

export class Float extends Expression {
    constructor(
        public readonly value: number,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return Number.isInteger(this.value) ? `${this.value}.0` : `${this.value}`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.value];
    }
}
