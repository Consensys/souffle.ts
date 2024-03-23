import { DatalogType, TypeEnv } from "./types";
import * as ast from "./ast";

export class Relation {
    constructor(
        public readonly name: string,
        public readonly fields: Array<[string, DatalogType]>
    ) {}
}

export function getRelations(prog: ast.Program, env: TypeEnv): Relation[] {
    const res: Relation[] = [];

    for (const d of prog) {
        if (d instanceof ast.RelationDecl) {
            res.push(
                new Relation(
                    d.name,
                    d.args.map(([name, typ]) => [
                        name,
                        env.mustLookupType((typ as ast.NamedType).name)
                    ])
                )
            );
        }
    }

    return res;
}
