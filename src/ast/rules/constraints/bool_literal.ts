import { Node, Src } from "../../node";
import { Constraint } from "./constraint";

export class BoolLiteral extends Constraint {
    constructor(
        public readonly value: boolean,
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
        return new BoolLiteral(this.value, this.src) as this;
    }
}
