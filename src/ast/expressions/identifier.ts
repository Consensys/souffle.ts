import { Node, Src } from "../node";
import { Expression } from "./expression";

export class Identifier extends Expression {
    constructor(
        public readonly name: string,
        src: Src
    ) {
        super(src);
    }

    pp(): string {
        return this.name;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.name];
    }
}
