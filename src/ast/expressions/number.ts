import { Node, Src } from "../node";
import { Expression } from "./expression";

export class Num extends Expression {
    constructor(
        public readonly value: bigint,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.value}`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.value];
    }

    copy(): this {
        return new Num(this.value, this.src) as this;
    }
}
