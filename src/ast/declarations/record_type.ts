import { Node, Src } from "../node";
import { Type } from "../types";
import { Declaration } from "./declaration";

export class RecordType extends Declaration {
    constructor(
        public readonly name: string,
        public readonly fields: Array<[string, Type]>,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.type ${this.name} = [${this.fields
            .map((f) => `${f[0]}: ${f[1].pp()}`)
            .join(", ")}]`;
    }

    children(): Iterable<Node> {
        return this.fields.map((x) => x[1]);
    }

    getStructId(): any {
        return [this.name, this.fields];
    }

    copy(): this {
        return new RecordType(
            this.name,
            this.fields.map(([name, typ]) => [name, typ.copy()]),
            this.src
        ) as this;
    }
}
