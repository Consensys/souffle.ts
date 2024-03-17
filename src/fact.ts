import { Relation } from "./relation";
import {
    RecordT,
    SubT,
    DatalogType,
    NumberT,
    SymbolT,
    AliasT,
    ADTT,
    UnsignedT,
    FloatT
} from "./types";
import { parseExpression } from "./parser";
import * as ast from "./ast";
import { assert } from "./utils";

function getBranch(typ: ADTT, branch: string): [string, Array<[string, DatalogType]>] {
    const filtered = typ.branches.filter(([name]) => name === branch);

    assert(filtered.length === 1, `Couldn't find branch hamed ${branch} in ADT ${typ.name}`);

    return filtered[0];
}

/**
 * Convert a literal Expression AST to a FieldVal.
 */
function literalExprToVal(expr: ast.Expression, typ: DatalogType): FieldVal {
    if (expr instanceof ast.Num) {
        return expr.value;
    }

    if (expr instanceof ast.StringLiteral) {
        return expr.value;
    }

    if (expr instanceof ast.Nil) {
        assert(typ instanceof RecordT, ``);
        return null;
    }

    if (expr instanceof ast.RecordLiteral) {
        assert(typ instanceof RecordT, ``);
        assert(typ.fields.length === expr.args.length, ``);

        return Object.fromEntries(
            expr.args.map((_, i) => [
                typ.fields[i][0],
                literalExprToVal(expr.args[i], typ.fields[i][1])
            ])
        );
    }

    if (expr instanceof ast.ADTLiteral) {
        assert(typ instanceof ADTT, ``);
        const branchT = getBranch(typ, expr.branch);

        return [
            expr.branch,
            Object.fromEntries(
                expr.args.map((_, i) => [
                    branchT[1][i][0],
                    literalExprToVal(expr.args[i], branchT[1][i][1])
                ])
            )
        ];
    }

    throw new Error(`NYI translating ${expr.pp()} of type ${typ.name} to FieldVal`);
}

export function parseValueInt(source: string, typ: DatalogType): FieldVal {
    return literalExprToVal(parseExpression(source), typ);
}

export type RecordVal = { [field: string]: FieldVal };
export type ADTVal = [string, RecordVal];
export type FieldVal = string | bigint | number | RecordVal | ADTVal | null;

function isADT(v: FieldVal): v is ADTVal {
    return v instanceof Array;
}

function isRecord(v: FieldVal): v is RecordVal {
    return v instanceof Object && !isADT(v);
}

// TODO: A lot of functions with very similar structure. Code duplication probably here

function fieldValToJSON(val: FieldVal, typ: DatalogType): any {
    if (typ === SymbolT) {
        return val;
    }

    if (typ === NumberT || typ === UnsignedT || typ === FloatT) {
        return Number(val);
    }

    if (typ instanceof SubT) {
        return fieldValToJSON(val, typ.parentT);
    }

    if (typ instanceof AliasT) {
        return fieldValToJSON(val, typ.originalT);
    }

    if (typ instanceof RecordT) {
        if (val === null) {
            return null;
        }

        assert(isRecord(val), `Expected a Record in fieldValToJSON, not ${val}`);

        return typ.fields.map(([name, fieldT]) => fieldValToJSON(val[name], fieldT));
    }

    if (typ instanceof ADTT) {
        return val as string;
    }

    throw new Error(`NYI type ${typ.name}`);
}

export function ppFieldVal(val: FieldVal, typ: DatalogType): string {
    if (typ === SymbolT) {
        return val as string;
    }

    if (typ === NumberT || typ === UnsignedT || typ === FloatT) {
        return `${val as number | bigint}`;
    }

    if (typ instanceof SubT) {
        return ppFieldVal(val, typ.parentT);
    }

    if (typ instanceof AliasT) {
        return ppFieldVal(val, typ.originalT);
    }

    if (typ instanceof RecordT) {
        if (val === null) {
            return `nil`;
        }

        assert(isRecord(val), `Expected an object in ppFieldVal`);

        return `[${typ.fields.map(([name, fieldT]) => ppFieldVal(val[name], fieldT)).join(", ")}]`;
    }

    if (typ instanceof ADTT) {
        return val as string;
    }

    throw new Error(`NYI type ${typ.name}`);
}

function parseFieldValFromCsv(val: any, typ: DatalogType): FieldVal {
    if (typ === NumberT || typ === UnsignedT || typ === FloatT) {
        assert(typeof val === "number", `Expected a number`);

        return val;
    }

    if (typ === SymbolT) {
        return String(val);
    }

    if (typ instanceof SubT) {
        return parseFieldValFromCsv(val, typ.parentT);
    }

    if (typ instanceof AliasT) {
        return parseFieldValFromCsv(val, typ.originalT);
    }

    if (typ instanceof RecordT) {
        assert(typeof val === "string", `Expected a string`);

        return parseValueInt(val, typ);
    }

    if (typ instanceof ADTT) {
        return val;
    }

    throw new Error(`NYI datalog type "${typ.name}"`);
}

function parseFieldValFromSQL(val: any, typ: DatalogType): FieldVal {
    if (typ === NumberT || typ === UnsignedT || typ === FloatT) {
        assert(typeof val === "number", `Expected a number`);

        return val;
    }

    if (typ === SymbolT) {
        assert(typeof val === "string", `Expected a string`);

        return val;
    }

    if (typ instanceof SubT) {
        return parseFieldValFromCsv(val, typ.parentT);
    }

    if (typ instanceof AliasT) {
        return parseFieldValFromCsv(val, typ.originalT);
    }

    if (typ instanceof RecordT) {
        if (typeof val === "string") {
            return parseValueInt(val, typ);
        }

        throw new Error(`NYI parsing record types from ${val}`);
    }

    if (typ.name === "Expression") {
        return val;
    }

    throw new Error(`NYI datalog type "${typ.name}"`);
}

export class Fact {
    private constructor(
        public readonly relation: Relation,
        public readonly fields: FieldVal[]
    ) {}

    toCSVRow(): string[] {
        return this.fields.map((x, i) => ppFieldVal(x, this.relation.fields[i][1]));
    }

    toJSON(): any {
        return this.fields.map((x, i) => fieldValToJSON(x, this.relation.fields[i][1]));
    }

    static fromCSVRow(rel: Relation, cols: string[]): Fact {
        assert(cols.length === rel.fields.length, ``);

        return new Fact(
            rel,
            cols.map((val, idx) => parseFieldValFromCsv(val, rel.fields[idx][1]))
        );
    }

    static fromCSVRows(rel: Relation, rows: string[][]): Fact[] {
        const fieldTypes = rel.fields.map(([, typ]) => typ);

        return rows.map(
            (cols) =>
                new Fact(
                    rel,
                    cols.map((val, idx) => parseFieldValFromCsv(val, fieldTypes[idx]))
                )
        );
    }

    static fromSQLRow(rel: Relation, obj: any): Fact {
        return new Fact(
            rel,
            rel.fields.map(([name, typ]) => parseFieldValFromSQL(obj[name], typ))
        );
    }

    static fromSQLRows(rel: Relation, objs: any[]): Fact[] {
        return objs.map(
            (obj) =>
                new Fact(
                    rel,
                    rel.fields.map(([name, typ]) => parseFieldValFromSQL(obj[name], typ))
                )
        );
    }
}
