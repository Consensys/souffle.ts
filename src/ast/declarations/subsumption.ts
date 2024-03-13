import { Node, Src } from "../node";
import { Atom } from "../rules/atom";
import { Disjunction } from "../rules/logical";
import { Declaration } from "./declaration";
import { QueryPlan } from "./rule";

export class Subsumption extends Declaration {
    constructor(
        public readonly dominatedHead: Atom,
        public readonly dominatingHead: Atom,
        public readonly body: Disjunction,
        public queryPlan: QueryPlan,
        src: Src
    ) {
        super(src);
    }

    pp(indent: string = ""): string {
        let queryPlanStr = "";

        if (this.queryPlan.length > 0) {
            queryPlanStr += ".plan";
            queryPlanStr += this.queryPlan
                .map(([num, nums]) => `${num}: (${nums.map((x) => `${x}`).join(", ")})`)
                .join(", ");
        }

        return `${indent}${this.dominatedHead.pp()} <= ${this.dominatingHead.pp()} :- ${this.body.pp()}.${queryPlanStr}`;
    }

    children(): Iterable<Node> {
        return [this.dominatedHead, this.dominatingHead, this.body];
    }

    getStructId(): any {
        return [this.dominatedHead, this.dominatingHead, this.body, this.queryPlan];
    }
}
