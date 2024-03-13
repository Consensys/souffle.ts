import { Node, Src } from "../node";
import { Type } from "../types";
import { Declaration } from "./declaration";

export class Functor extends Declaration {
    constructor(
        public readonly name: string,
        public readonly args: Array<[string, Type]>,
        public readonly returnType: Type,
        public readonly stateful: boolean,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.functor ${this.name}(${this.args
            .map(([name, typ]) => `${name}: ${typ.pp()}`)
            .join(", ")}): ${this.returnType.pp()}${this.stateful ? " stateful" : ""}`;
    }

    children(): Iterable<Node> {
        return [...this.args.map((x) => x[1]), this.returnType];
    }

    getStructId(): any {
        return [this.name, this.args, this.returnType, this.stateful];
    }
}
