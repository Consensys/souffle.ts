import { Node, Src } from "../node";
import { Type } from "../types";
import { Expression } from "./expression";

export class TypeCast extends Expression {
    constructor(
        public readonly subexpr: Expression,
        public readonly type: Type,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `as(${this.subexpr.pp()}, ${this.type.pp()})`;
    }

    children(): Iterable<Node> {
        return [this.subexpr, this.type];
    }

    getStructId(): any {
        return [this.subexpr, this.type];
    }

    copy(): this {
        return new TypeCast(this.subexpr.copy(), this.type.copy(), this.src) as this;
    }
}
