import { Expression } from "../../expressions";
import { Node, Src } from "../../node";
import { Constraint } from "./constraint";

export type ComparisonOp = "<" | ">" | "<=" | ">=" | "=" | "!=";

export class Comparison extends Constraint {
    constructor(
        public readonly lhs: Expression,
        public readonly op: ComparisonOp,
        public readonly rhs: Expression,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.lhs.pp()} ${this.op} ${this.rhs.pp()}`;
    }

    children(): Iterable<Node> {
        return [this.lhs, this.rhs];
    }

    getStructId(): any {
        return [this.lhs, this.op, this.rhs];
    }
}
