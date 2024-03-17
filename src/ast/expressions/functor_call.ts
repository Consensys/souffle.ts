import { Node, Src } from "../node";
import { Expression } from "./expression";

export class FunctorCall extends Expression {
    constructor(
        public readonly name: string,
        public readonly args: Expression[],
        public readonly builtin: boolean,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.builtin ? this.name : "@" + this.name}(${this.args.map((a) => a.pp()).join(", ")})`;
    }

    children(): Iterable<Node> {
        return this.args;
    }

    getStructId(): any {
        return [this.name, ...this.args, this.builtin];
    }
}
