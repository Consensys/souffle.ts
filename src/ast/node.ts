let nodeCtr = 0;

export type Src = any;

export abstract class Node {
    readonly id: number;
    readonly src: Src;

    constructor(src: Src) {
        this.id = nodeCtr++;
        this.src = src;
    }

    abstract pp(indent?: string): string;
    abstract getStructId(): any;
    abstract children(): Iterable<Node>;
    abstract copy(): this;
}
