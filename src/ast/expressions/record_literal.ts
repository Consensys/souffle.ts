import { Node, Src } from "../node";
import { Expression } from "./expression";

export class RecordLiteral extends Expression {
    constructor(
        public readonly args: Expression[],
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `[${this.args.map((a) => a.pp()).join(", ")}]`;
    }

    children(): Iterable<Node> {
        return this.args;
    }

    getStructId(): any {
        return this.args;
    }
}
