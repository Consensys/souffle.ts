import { Node, Src } from "../node";
import { Declaration } from "./declaration";

export type ComponentBaseInvocation = [string, string[]];
export class Component extends Declaration {
    constructor(
        public readonly name: string,
        public readonly typeParams: string[],
        public readonly bases: ComponentBaseInvocation[],
        public readonly body: Declaration[],
        src: Src
    ) {
        super(src);
    }

    static ppCompInv(inv: ComponentBaseInvocation): string {
        return `${inv[0]}${inv[1].length > 0 ? `<${inv[1].join(", ")}>` : ""}`;
    }

    pp(indent: string = ""): string {
        const innerIndent = indent + "    ";

        return `${indent}.comp ${Component.ppCompInv([this.name, this.typeParams])}${
            this.bases.length == 0 ? "" : ":" + this.bases.map(Component.ppCompInv).join(", ")
        } {
            ${this.body.map((x) => x.pp(innerIndent)).join("\n")}
        }`;
    }

    children(): Iterable<Node> {
        return this.body;
    }

    getStructId(): any {
        return [this.name, this.typeParams, this.bases, this.body];
    }

    copy(): this {
        return new Component(
            this.name,
            [...this.typeParams],
            this.bases.map(([name, params]) => [name, [...params]]),
            this.body.map((decl) => decl.copy()),
            this.src
        ) as this;
    }
}
