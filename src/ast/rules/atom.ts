import { Node, Src } from "../node";
import { Expression } from "../expressions";

export class Atom extends Node {
    constructor(
        public readonly name: string,
        public readonly args: Expression[],
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return `${this.name}(${this.args.map((x) => x.pp()).join(", ")})`;
    }

    children(): Iterable<Node> {
        return this.args;
    }

    getStructId(): any {
        return [this.name, this.args];
    }
}
