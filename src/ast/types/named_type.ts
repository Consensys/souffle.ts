import { Node, Src } from "../node";
import { Type } from "./type";

export class NamedType extends Type {
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

    copy(): this {
        return new NamedType(this.name, this.src) as this;
    }
}
