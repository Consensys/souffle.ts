import { Node, Src } from "../node";
import { Expression } from "./expression";

export type BinaryOp =
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "^"
    | "land"
    | "lor"
    | "lxor"
    | "band"
    | "bor"
    | "bxor"
    | "bshl"
    | "bshr"
    | "bshru";

export class BinaryOperator extends Expression {
    constructor(
        public readonly left: Expression,
        public readonly op: BinaryOp,
        public readonly right: Expression,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.left.pp()} ${this.op} ${this.right.pp()}`;
    }

    children(): Iterable<Node> {
        return [this.left, this.right];
    }

    getStructId(): any {
        return [this.left, this.op, this.right];
    }

    copy(): this {
        return new BinaryOperator(this.left.copy(), this.op, this.right.copy(), this.src) as this;
    }
}
