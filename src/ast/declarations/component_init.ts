import { Node, Src } from "../node";
import { Component, ComponentBaseInvocation } from "./component";
import { Declaration } from "./declaration";

export class ComponentInit extends Declaration {
    constructor(
        public readonly name: string,
        public readonly inv: ComponentBaseInvocation,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        return `${indent}.init ${this.name} = ${Component.ppCompInv(this.inv)}`;
    }

    children(): Iterable<Node> {
        return [];
    }

    getStructId(): any {
        return [this.name, this.inv[0], ...this.inv[1]];
    }

    copy(): this {
        return new ComponentInit(this.name, [this.inv[0], [...this.inv[1]]], this.src) as this;
    }
}
