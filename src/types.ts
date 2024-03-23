import * as ast from "./ast";
import { assert } from "./utils";

// In-memory representation of Datalog types.
// Unlike the AST nodes DatalogType objects may be
// recursive for recusrively defined types.
export abstract class DatalogType {
    constructor(public readonly name: string) {}
}
class PrimitiveT extends DatalogType {}
export class NamedT extends DatalogType {}

export const NumberT = new PrimitiveT("number");
export const UnsignedT = new PrimitiveT("unsigned");
export const SymbolT = new PrimitiveT("symbol");
export const FloatT = new PrimitiveT("float");

export class AliasT extends DatalogType {
    constructor(
        name: string,
        public readonly originalT: DatalogType
    ) {
        super(name);
    }
}

export class UnionT extends DatalogType {
    constructor(
        name: string,
        public readonly optionTs: DatalogType[]
    ) {
        super(name);
    }
}

export class SubT extends DatalogType {
    constructor(
        name: string,
        public readonly parentT: DatalogType
    ) {
        super(name);
    }
}

export class RecordT extends DatalogType {
    constructor(
        name: string,
        public fields: Array<[string, DatalogType]>
    ) {
        super(name);
    }
}

export class ADTT extends DatalogType {
    constructor(
        name: string,
        public branches: Array<[string, Array<[string, DatalogType]>]>
    ) {
        super(name);
    }

    branch(name: string): Array<[string, DatalogType]> {
        const res = this.branches.filter(([bName]) => bName === name);
        assert(res.length === 1, ``);

        return res[0][1];
    }
}

export class TypeEnv {
    private env: Map<string, DatalogType> = new Map();

    private constructor() {}

    lookupType(name: string): DatalogType | undefined {
        return this.env.get(name);
    }

    mustLookupType(name: string): DatalogType {
        const res = this.lookupType(name);
        assert(res !== undefined, `Unexpected missing type ${name}.`);
        return res as DatalogType;
    }

    *types(): Generator<DatalogType> {
        for (const t of this.env.values()) {
            yield t;
        }
    }

    static buildTypeEnv(prog: ast.Program): TypeEnv {
        const res = new TypeEnv();

        // Builtin Types
        res.env.set("number", NumberT);
        res.env.set("unsigned", UnsignedT);
        res.env.set("float", FloatT);
        res.env.set("symbol", SymbolT);

        for (const d of prog) {
            if (d instanceof ast.SubsetType) {
                res.env.set(
                    d.name,
                    new SubT(d.name, res.mustLookupType((d.originalType as ast.NamedType).name))
                );
            } else if (d instanceof ast.AliasType) {
                res.env.set(
                    d.name,
                    new AliasT(d.name, res.mustLookupType((d.originalType as ast.NamedType).name))
                );
            } else if (d instanceof ast.UnionType) {
                res.env.set(
                    d.name,
                    new UnionT(
                        d.name,
                        d.types.map((t) => res.mustLookupType((t as ast.NamedType).name))
                    )
                );
            } else if (d instanceof ast.RecordType) {
                // Since record/adt types can be recursive we first register the type, then set fields
                const t = new RecordT(d.name, []);
                res.env.set(d.name, t);

                t.fields = d.fields.map(([name, typ]) => [
                    name,
                    res.mustLookupType((typ as ast.NamedType).name)
                ]);
            } else if (d instanceof ast.AlgebraicDataType) {
                // Since record/adt types can be recursive we first register the type, then set fields
                const t = new ADTT(d.name, []);
                res.env.set(d.name, t);

                t.branches = d.branches.map(([branch, fields]) => [
                    branch,
                    fields.map(([name, typ]) => [
                        name,
                        res.mustLookupType((typ as ast.NamedType).name)
                    ])
                ]);
            }
        }

        return res;
    }
}
