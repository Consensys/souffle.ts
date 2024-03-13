import { Node, Src } from "../node";
import { Atom } from "../rules/atom";
import { Disjunction } from "../rules/logical";
import { Declaration } from "./declaration";

export type QueryPlan = Array<[number, number[]]>;

export class Rule extends Declaration {
    constructor(
        public readonly head: Atom,
        public readonly body: Disjunction,
        public queryPlan: QueryPlan,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        let queryPlanStr = "";

        if (this.queryPlan.length > 0) {
            queryPlanStr += " .plan";
            queryPlanStr += this.queryPlan
                .map(([num, nums]) => `${num}: (${nums.map((x) => `${x}`).join(", ")})`)
                .join(", ");
        }
        return `${indent}${this.head.pp()} :- ${this.body.pp().slice(1, -1)}.${queryPlanStr}`;
    }

    children(): Iterable<Node> {
        return [this.head, this.body];
    }

    getStructId(): any {
        return [this.head, this.body, this.queryPlan];
    }
}
