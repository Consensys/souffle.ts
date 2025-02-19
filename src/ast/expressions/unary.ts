import { Node, Src } from "../node";
import { Expression } from "./expression";

export type UnaryOp = "-" | "bnot" | "lnot";

export class UnaryOperator extends Expression {
    constructor(
        public readonly op: UnaryOp,
        public readonly subExpr: Expression,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.op}${this.subExpr.pp()}`;
    }

    children(): Iterable<Node> {
        return [this.subExpr];
    }

    getStructId(): any {
        return [this.op, this.subExpr];
    }

    copy(): this {
        return new UnaryOperator(this.op, this.subExpr.copy(), this.src) as this;
    }
}
