import * as ast from "../ast";

const ProgramParser = (require("./souffle_parser_gen") as any).Parser;
const ExprParser = (require("./souffle_value_parser_gen") as any).Parser;
const programParser = new ProgramParser();
const exprParser = new ExprParser();

export function parseProgram(s: string): ast.Program {
    return programParser.parse(s);
}

export function parseExpression(s: string): ast.Expression {
    return exprParser.parse(s);
}
