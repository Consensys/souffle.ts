import { Node, Src } from "../node";
import { Expression } from "./expression";

export class ADTLiteral extends Expression {
    constructor(
        public readonly branch: string,
        public readonly args: Expression[],
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `$${this.branch}(${this.args.map((a) => a.pp()).join(", ")})`;
    }

    children(): Iterable<Node> {
        return this.args;
    }

    getStructId(): any {
        return [this.branch, this.args];
    }

    copy(): this {
        return new ADTLiteral(
            this.branch,
            this.args.map((e) => e.copy()),
            this.src
        ) as this;
    }
}
