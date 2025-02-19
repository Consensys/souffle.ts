import { Expression } from "../../expressions";
import { Node, Src } from "../../node";
import { Constraint } from "./constraint";

export class StringConstraint extends Constraint {
    constructor(
        public readonly name: "match" | "contains",
        public readonly lhs: Expression,
        public readonly rhs: Expression,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.name}(${this.lhs.pp()}, ${this.rhs.pp()})`;
    }

    children(): Iterable<Node> {
        return [this.lhs, this.rhs];
    }

    getStructId(): any {
        return [this.name, this.lhs, this.rhs];
    }

    copy(): this {
        return new StringConstraint(this.name, this.lhs.copy(), this.rhs.copy(), this.src) as this;
    }
}
