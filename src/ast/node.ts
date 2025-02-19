import { PPAble, StructEqualityComparable } from "../utils";

let nodeCtr = 0;

export type Src = any;

export abstract class Node implements PPAble, StructEqualityComparable {
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
