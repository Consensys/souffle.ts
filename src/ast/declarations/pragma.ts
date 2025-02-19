import { Node, Src } from "../node";
import { Declaration } from "./declaration";

export class Pragma extends Declaration {
    constructor(
        public readonly name: string,
        public readonly value: string | undefined,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.pragma ${this.name}${this.value ? " " + this.value : ""}`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.name, this.value];
    }

    copy(): this {
        return new Pragma(this.name, this.value, this.src) as this;
    }
}
