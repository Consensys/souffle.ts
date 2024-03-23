%{
/* tslint:disable */

const ast = require("../ast");

function lexError(err) {
  throw new Error(err);
}

function lexNYI(token) {
  lexError(`Lexer NYI "${token}"`)
}

function parseError(err) {
  throw new Error(err);
}

function parseNYI(token) {
  lexError(`Parser NYI "${token}"`)
}
%}

%lex
%x INCLUDE_TOK COMMENT_TOK
%%

// Skip whitespace and comments
"//".*\n                               {} 
"/*"                                   this.begin("COMMENT_TOK");
<COMMENT_TOK>"*/"                      this.begin("INITIAL_TOK");
<COMMENT_TOK>[^*\n]+                   {}           
<COMMENT_TOK>"*"                       {}
<COMMENT_TOK>\n                        {}
<COMMENT_TOK><<EOF>>                   lexError('Unterminated comment');
<INCLUDE_TOK>{WS}+                     {} 
<INCLUDE_TOK>\"(\\.|[^"\\])*\"         this.begin("INITIAL");
<INCLUDE_TOK>.                         lexError(`Unexpected ${yytext} in include`);
\s+                                    {}
".decl"                                return "DECL_TOK"
".functor"                             return "FUNCTOR_TOK"
".input"                               return "INPUT_DECL_TOK"
".output"                              return "OUTPUT_DECL_TOK"
".printsize"                           return "PRINTSIZE_DECL_TOK"
".limitsize"                           return "LIMITSIZE_DECL_TOK"
".type"                                return "TYPE_TOK"
".comp"                                return "COMPONENT_TOK"
".init"                                return "INSTANTIATE_TOK"
".number_type"                         return "NUMBER_TYPE_TOK"
".symbol_type"                         return "SYMBOL_TYPE_TOK"
".override"                            return "OVERRIDE_TOK"
".pragma"                              return "PRAGMA_TOK"
".plan"                                return "PLAN_TOK"
".lattice"                             return "LATTICE_TOK"
".include"                             yy.LastIncludeDirectiveLoc = yylloc; this.begin("INCLUDE_TOK");
".once"                                lexNYI(yytext);
"debug_delta"                          return "DEBUG_DELTA_TOK"
"autoinc"                              return "AUTOINC_TOK"
"band"                                 return "BW_AND_TOK"
"bor"                                  return "BW_OR_TOK"
"bxor"                                 return "BW_XOR_TOK"
"bnot"                                 return "BW_NOT_TOK"
"bshl"                                 return "BW_SHIFT_L_TOK"
"bshr"                                 return "BW_SHIFT_R_TOK"
"bshru"                                return "BW_SHIFT_R_UNSIGNED_TOK"
"lan"                                  return "L_AND_TOK"
"lor"                                  return "L_OR_TOK"
"lxor"                                 return "L_XOR_TOK"
"lnot"                                 return "L_NOT_TOK"
"match"                                return "TMATCH_TOK"
"mean"                                 return "MEAN_TOK"
"cat"                                  return "CAT_TOK"
"ord"                                  return "ORD_TOK"
"fold"                                 return "FOLD_TOK"
"range"                                return "RANGE_TOK"
"strlen"                               return "STRLEN_TOK"
"substr"                               return "SUBSTR_TOK"
"stateful"                             return "STATEFUL_TOK"
"contains"                             return "TCONTAINS_TOK"
"output"                               return "OUTPUT_QUALIFIER_TOK"
"input"                                return "INPUT_QUALIFIER_TOK"
"overridable"                          return "OVERRIDABLE_QUALIFIER_TOK"
"printsize"                            return "PRINTSIZE_QUALIFIER_TOK"
"eqrel"                                return "EQREL_QUALIFIER_TOK"
"inline"                               return "INLINE_QUALIFIER_TOK"
"no_inline"                            return "NO_INLINE_QUALIFIER_TOK"
"magic"                                return "MAGIC_QUALIFIER_TOK"
"no_magic"                             return "NO_MAGIC_QUALIFIER_TOK"
"brie"                                 return "BRIE_QUALIFIER_TOK"
"btree_delete"                         return "BTREE_DELETE_QUALIFIER_TOK"
"btree"                                return "BTREE_QUALIFIER_TOK"
"min"                                  return "MIN_TOK"
"max"                                  return "MAX_TOK"
"as"                                   return "AS_TOK"
"nil"                                  return "NIL_TOK"
"_"                                    return "UNDERSCORE_TOK"
"count"                                return "COUNT_TOK"
"sum"                                  return "SUM_TOK"
"true"                                 return "TRUELIT_TOK"
"false"                                return "FALSELIT_TOK"
"to_float"                             return "TOFLOAT_TOK"
"to_number"                            return "TONUMBER_TOK"
"to_string"                            return "TOSTRING_TOK"
"to_unsigned"                          return "TOUNSIGNED_TOK"
"choice-domain"                        return "CHOICEDOMAIN_TOK"
"recursive_iteration_cnt"              return "ITERATION_TOK"
"__FILE__"                             lexNYI(yytext);
"__LINE__"                             lexNYI(yytext);
"__INCL__"                             lexNYI(yytext);
"|"                                    return "PIPE_TOK"
"["                                    return "LBRACKET_TOK"
"]"                                    return "RBRACKET_TOK"
"$"                                    return "DOLLAR_TOK"
"+"                                    return "PLUS_TOK"
"->"                                   return "MAPSTO_TOK"
"-"                                    return "MINUS_TOK"
"("                                    return "LPAREN_TOK"
")"                                    return "RPAREN_TOK"
","                                    return "COMMA_TOK"
":-"                                   return "IF_TOK"
":"                                    return "COLON_TOK"
";"                                    return "SEMICOLON_TOK"
"."                                    return "DOT_TOK"
"<:"                                   return "SUBTYPE_TOK"
"<="                                   return "LE_TOK"
">="                                   return "GE_TOK"
"!="                                   return "NE_TOK"
"="                                    return "EQUALS_TOK"
"!"                                    return "EXCLAMATION_TOK"
"*"                                    return "STAR_TOK"
"@"                                    return "AT_TOK"
"/"                                    return "SLASH_TOK"
"^"                                    return "CARET_TOK"
"%"                                    return "PERCENT_TOK"
"{"                                    return "LBRACE_TOK"
"}"                                    return "RBRACE_TOK"
"<"                                    return "LT_TOK"
">"                                    return "GT_TOK"
[0-9]+"."[0-9]+"."[0-9]+"."[0-9]+      lexNYI(yytext); 
[0-9]+[.][0-9]+                        return "FLOAT_TOK"
[0-9]+                                 return "NUMBER_TOK"
0b[0-1]+                               return "NUMBER_TOK"
0x[a-fA-F0-9]+                         return "NUMBER_TOK"
[0-9]+u                                return "UNSIGNED_TOK"
0b[0-1]+u                              return "UNSIGNED_TOK"
0x[a-fA-F0-9]+u                        return "UNSIGNED_TOK"
[_\?a-zA-Z][_\?a-zA-Z0-9]*             return "IDENT_TOK";
\"(\\.|[^"\\])*\"                      return "STRING_TOK";
\#.*$                                  lexNYI(yytext); 
<<EOF>>                                {}
.                                      lexError(`Unexpected token "${yytext}"`);

/lex

%token "END_TOK" 0                     "end of file"
%token "STRING_TOK"                    "symbol"
%token "IDENT_TOK"                     "identifier"
%token "NUMBER_TOK"                    "number"
%token "UNSIGNED_TOK"                  "unsigned number"
%token "FLOAT_TOK"                     "float"
%token "AUTOINC_TOK"                   "auto-increment functor"
%token "PRAGMA_TOK"                    "pragma directive"
%token "OUTPUT_QUALIFIER_TOK"          "relation qualifier output"
%token "INPUT_QUALIFIER_TOK"           "relation qualifier input"
%token "PRINTSIZE_QUALIFIER_TOK"       "relation qualifier printsize"
%token "BRIE_QUALIFIER_TOK"            "BRIE datastructure qualifier"
%token "BTREE_QUALIFIER_TOK"           "BTREE datastructure qualifier"
%token "BTREE_DELETE_QUALIFIER_TOK"    "BTREE_DELETE datastructure qualifier"
%token "EQREL_QUALIFIER_TOK"           "equivalence relation qualifier"
%token "OVERRIDABLE_QUALIFIER_TOK"     "relation qualifier overidable"
%token "INLINE_QUALIFIER_TOK"          "relation qualifier inline"
%token "NO_INLINE_QUALIFIER_TOK"       "relation qualifier no_inline"
%token "MAGIC_QUALIFIER_TOK"           "relation qualifier magic"
%token "NO_MAGIC_QUALIFIER_TOK"        "relation qualifier no_magic"
%token "TMATCH_TOK"                    "match predicate"
%token "TCONTAINS_TOK"                 "checks whether substring is contained in a string"
%token "STATEFUL_TOK"                  "stateful functor"
%token "CAT_TOK"                       "concatenation of strings"
%token "ORD_TOK"                       "ordinal number of a string"
%token "RANGE_TOK"                     "range"
%token "STRLEN_TOK"                    "length of a string"
%token "SUBSTR_TOK"                    "sub-string of a string"
%token "MEAN_TOK"                      "mean aggregator"
%token "MIN_TOK"                       "min aggregator"
%token "MAX_TOK"                       "max aggregator"
%token "COUNT_TOK"                     "count aggregator"
%token "SUM_TOK"                       "sum aggregator"
%token "TRUELIT_TOK"                   "true literal constraint"
%token "FALSELIT_TOK"                  "false literal constraint"
%token "PLAN_TOK"                      "plan keyword"
%token "ITERATION_TOK"                 "recursive iteration keyword"
%token "CHOICEDOMAIN_TOK"              "choice-domain"
%token "IF_TOK"                        ":-"
%token "DECL_TOK"                      "relation declaration"
%token "FUNCTOR_TOK"                   "functor declaration"
%token "INPUT_DECL_TOK"                "input directives declaration"
%token "OUTPUT_DECL_TOK"               "output directives declaration"
%token "DEBUG_DELTA_TOK"               "debug_delta"
%token "UNIQUE_TOK"                    "unique"
%token "PRINTSIZE_DECL_TOK"            "printsize directives declaration"
%token "LIMITSIZE_DECL_TOK"            "limitsize directives declaration"
%token "OVERRIDE_TOK"                  "override rules of super-component"
%token "TYPE_TOK"                      "type declaration"
%token "LATTICE_TOK"                   "lattice declaration"
%token "COMPONENT_TOK"                 "component declaration"
%token "INSTANTIATE_TOK"               "component instantiation"
%token "NUMBER_TYPE_TOK"               "numeric type declaration"
%token "SYMBOL_TYPE_TOK"               "symbolic type declaration"
%token "TOFLOAT_TOK"                   "convert to float"
%token "TONUMBER_TOK"                  "convert to signed integer"
%token "TOSTRING_TOK"                  "convert to string"
%token "TOUNSIGNED_TOK"                "convert to unsigned integer"
%token "ITOU_TOK"                      "convert int to unsigned"
%token "ITOF_TOK"                      "convert int to float"
%token "UTOI_TOK"                      "convert unsigned to int"
%token "UTOF_TOK"                      "convert unsigned to float"
%token "FTOI_TOK"                      "convert float to int"
%token "FTOU_TOK"                      "convert float to unsigned"
%token "AS_TOK"                        "type cast"
%token "AT_TOK"                        "@"
%token "NIL_TOK"                       "nil reference"
%token "PIPE_TOK"                      "|"
%token "LBRACKET_TOK"                  "["
%token "RBRACKET_TOK"                  "]"
%token "UNDERSCORE_TOK"                "_"
%token "DOLLAR_TOK"                    "$"
%token "EXCLAMATION_TOK"               "!"
%token "LPAREN_TOK"                    "("
%token "RPAREN_TOK"                    ")"
%token "COMMA_TOK"                     ","
%token "COLON_TOK"                     ":"
%token "DOUBLECOLON_TOK"               "::"
%token "SEMICOLON_TOK"                 ";"
%token "DOT_TOK"                       "."
%token "EQUALS_TOK"                    "="
%token "LBRACE_TOK"                    "{"
%token "RBRACE_TOK"                    "}"
%token "SUBTYPE_TOK"                   "<:"
%token "LT_TOK"                        "<"
%token "GT_TOK"                        ">"
%token "LE_TOK"                        "<="
%token "GE_TOK"                        ">="
%token "NE_TOK"                        "!="
%token "MAPSTO_TOK"                    "->"
%token "FOLD_TOK"                      "fold"

/* -- Operator precedence -- */
%left "L_OR_TOK"
%left "L_XOR_TOK"
%left "L_AND_TOK"
%left "BW_OR_TOK"
%left "BW_XOR_TOK"
%left "BW_AND_TOK"
%left "BW_SHIFT_L_TOK" "BW_SHIFT_R_TOK" "BW_SHIFT_R_UNSIGNED_TOK"
%left "PLUS_TOK" "MINUS_TOK"
%left "STAR_TOK" "SLASH_TOK" "PERCENT_TOK"
%nonassoc "NEG_TOK" "BW_NOT_TOK" "L_NOT_TOK"
%right "CARET_TOK"

%start value

%%

/**
 * Terminal symbols
 */

value
  : arg
  {
    return $1;
  }
  ;
 
NUMBER_TYPE:	"NUMBER_TYPE_TOK";
SYMBOL_TYPE:	"SYMBOL_TYPE_TOK";
AUTOINC:	"AUTOINC_TOK";
TMATCH:	"TMATCH_TOK";
MEAN:	"MEAN_TOK";
CAT:	"CAT_TOK";
ORD:	"ORD_TOK";
FOLD:	"FOLD_TOK";
RANGE:	"RANGE_TOK";
STRLEN:	"STRLEN_TOK";
SUBSTR:	"SUBSTR_TOK";
STATEFUL:	"STATEFUL_TOK";
TCONTAINS:	"TCONTAINS_TOK";
OUTPUT_QUALIFIER:	"OUTPUT_QUALIFIER_TOK";
INPUT_QUALIFIER:	"INPUT_QUALIFIER_TOK";
OVERRIDABLE_QUALIFIER:	"OVERRIDABLE_QUALIFIER_TOK";
PRINTSIZE_QUALIFIER:	"PRINTSIZE_QUALIFIER_TOK";
EQREL_QUALIFIER:	"EQREL_QUALIFIER_TOK";
INLINE_QUALIFIER:	"INLINE_QUALIFIER_TOK";
NO_INLINE_QUALIFIER:	"NO_INLINE_QUALIFIER_TOK";
MAGIC_QUALIFIER:	"MAGIC_QUALIFIER_TOK";
NO_MAGIC_QUALIFIER:	"NO_MAGIC_QUALIFIER_TOK";
BRIE_QUALIFIER:	"BRIE_QUALIFIER_TOK";
BTREE_DELETE_QUALIFIER:	"BTREE_DELETE_QUALIFIER_TOK";
BTREE_QUALIFIER:	"BTREE_QUALIFIER_TOK";
MIN:	"MIN_TOK";
MAX:	"MAX_TOK";
AS:	"AS_TOK";
NIL:	"NIL_TOK";
UNDERSCORE:	"UNDERSCORE_TOK";
COUNT:	"COUNT_TOK";
SUM:	"SUM_TOK";
TRUELIT:	"TRUELIT_TOK";
FALSELIT:	"FALSELIT_TOK";
TOFLOAT:	"TOFLOAT_TOK";
TONUMBER:	"TONUMBER_TOK";
TOSTRING:	"TOSTRING_TOK";
TOUNSIGNED:	"TOUNSIGNED_TOK";
CHOICEDOMAIN:	"CHOICEDOMAIN_TOK";
ITERATION:	"ITERATION_TOK";
PIPE:	"PIPE_TOK";
LBRACKET:	"LBRACKET_TOK";
RBRACKET:	"RBRACKET_TOK";
DOLLAR:	"DOLLAR_TOK";
MAPSTO:	"MAPSTO_TOK";
LPAREN:	"LPAREN_TOK";
RPAREN:	"RPAREN_TOK";
COMMA:	"COMMA_TOK";
COLON:	"COLON_TOK";
SEMICOLON:	"SEMICOLON_TOK";
SUBTYPE:	"SUBTYPE_TOK";
LE:	"LE_TOK";
GE:	"GE_TOK";
NE:	"NE_TOK";
EQUALS:	"EQUALS_TOK";
AT:	"AT_TOK";
LBRACE:	"LBRACE_TOK";
RBRACE:	"RBRACE_TOK";
LT:	"LT_TOK";
GT:	"GT_TOK";
IF:	"IF_TOK";
END:  "END_TOK";
FLOAT
  : "FLOAT_TOK"
  {
    $$ = Number(yytext);
  }
  ;
NUMBER
  : "NUMBER_TOK"
  {
    $$ = BigInt(yytext);
  }
  ;
UNSIGNED
  : "UNSIGNED_TOK"
  {
    $$ = BigInt(yytext.slice(0, -1));
  }
  ;
STRING
  : "STRING_TOK"
  {
    $$ = yytext;
  }
  ;
IDENT
  : "IDENT_TOK"
  {
    $$ = yytext;
  }
  ;

/**
 * A Qualified Name
 */

qualified_name
  : IDENT
    {
      $$ = $1;
    }
  | qualified_name DOT_TOK IDENT
    {
      $$ = $1 + "." + $3;
    }
  ;


/**
 * Argument List
 */
arg_list
  : %empty
    {
      $$ = [];
    }
  | non_empty_arg_list
    {
      $$ = $1;
    } ;

non_empty_arg_list
  : arg
    {
      $$ = [$1];
    }
  | non_empty_arg_list COMMA arg
    {
      $$ = $1; $$.push($3);
    }
  ;


/**
 * Atom argument
 */
arg
  : STRING
    {
      $$ = new ast.StringLiteral($1.slice(1, -1), @$);
    }
  | FLOAT
    {
      $$ = new ast.Float($1, @$);
    }
  | UNSIGNED
    {
      $$ = new ast.Unsigned($1, @$);
    }
  | NUMBER
    {
      $$ = new ast.Num($1, @$);
    }
  | ITERATION LPAREN RPAREN
    {
      parseNYI(`Iteration: ${yytext}`);
    }
  | UNDERSCORE
    {
      $$ = new ast.UnnamedVar(@$);
    }
  | DOLLAR
    {
      $$ = new ast.AutoIncrement(@$);
    }
  | AUTOINC LPAREN RPAREN
    {
      $$ = new ast.AutoIncrement(@$);
    }
  | IDENT
    {
      $$ = new ast.Identifier($1, @$);
    }
  | NIL
    {
      $$ = new ast.Nil(@$);
    }
  | LBRACKET arg_list RBRACKET
    {
      $$ = new ast.RecordLiteral($2, @$);
    }
  | branch_literal
  | LPAREN arg RPAREN
    {
      $$ = $2;
    }
  | AS LPAREN arg COMMA qualified_name RPAREN
    {
      $$ = new ast.TypeCast($3, new ast.NamedType($5), @$);
    }
  | AT IDENT LPAREN arg_list RPAREN
    {
      $$ = new ast.FunctorCall($2, $4, false, @$);
    }
  | functor_built_in LPAREN arg_list RPAREN
    {
      $$ = new ast.FunctorCall($1, $3, true, @$);
    }

    /* some aggregates have the same name as functors */
  | aggregate_func LPAREN arg[first] COMMA non_empty_arg_list[rest] RPAREN
    {
      parseNYI(`Aggregators ${yytext}`)
    }

    /* -- intrinsic functor -- */
    /* unary functors */
  | MINUS_TOK arg %prec NEG_TOK
    {
      $$ = new ast.UnaryOperator("-", $2, @$);
    }
  | BW_NOT_TOK  arg
    {
      $$ = new ast.UnaryOperator("~", $2, @$);
    }
  | L_NOT_TOK arg
    {
      $$ = new ast.UnaryOperator("!", $2, @$);
    }

    /* binary infix functors */
  | arg PLUS_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "+", $3, @$);
    }
  | arg MINUS_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "-", $3, @$);
    }
  | arg STAR_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "*", $3, @$);
    }
  | arg SLASH_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "/", $3, @$);
    }
  | arg PERCENT_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "%", $3, @$);
    }
  | arg CARET_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "**", $3, @$);
    }
  | arg L_AND_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "&&", $3, @$);
    }
  | arg L_OR_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "||", $3, @$);
    }
  | arg L_XOR_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "^^", $3, @$);
    }
  | arg BW_AND_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "&", $3, @$);
    }
  | arg BW_OR_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "|", $3, @$);
    }
  | arg BW_XOR_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "^", $3, @$);
    }
  | arg BW_SHIFT_L_TOK arg
    {
      $$ = new ast.BinaryOperator($1, "<<", $3, @$);
    }
  | arg BW_SHIFT_R_TOK arg
    {
      $$ = new ast.BinaryOperator($1, ">>", $3, @$);
    }
  | arg BW_SHIFT_R_UNSIGNED_TOK arg
    {
      $$ = new ast.BinaryOperator($1, ">>>", $3, @$);
    }
    /* -- User-defined aggregators -- */
  | AT AT IDENT arg_list COLON arg COMMA aggregate_body
    {
      parseNYI(`User-defined Aggregators ${yytext}`)
    }
    /* -- aggregators -- */
  | aggregate_func arg_list COLON aggregate_body
    {
      parseNYI(`Aggregators ${yytext}`)
    }
  ;

// We diverge from the Souffle grammar a bit here, as ADT literals in CSV files
// may omit the parenthesis when there are 0 args.
branch_literal
  : DOLLAR qualified_name LPAREN arg_list RPAREN
    {
      $$ = new ast.ADTLiteral($2, $4, @$);
    }
  | DOLLAR qualified_name
    {
      $$ = new ast.ADTLiteral($2, [], @$);
    }
  ;

functor_built_in
  : CAT
    {
      $$ = "cat";
    }
  | ORD
    {
      $$ = "ord";
    }
  | RANGE
    {
      $$ = "range";
    }
  | STRLEN
    {
      $$ = "strlen";
    }
  | SUBSTR
    {
      $$ = "substr";
    }
  | TOFLOAT
    {
      $$ = "to_float";
    }
  | TONUMBER
    {
      $$ = "to_number";
    }
  | TOSTRING
    {
      $$ = "to_string";
    }
  | TOUNSIGNED
    {
      $$ = "to_unsigned";
    }
  ;

aggregate_func
  : COUNT
    {
      $$ = "count";
    }
  | MAX
    {
      $$ = "max";
    }
  | MEAN
    {
      $$ = "mean";
    }
  | MIN
    {
      $$ = "min";
    }
  | SUM
    {
      $$ = "sum";
    }
  ;

aggregate_body
  : LBRACE body RBRACE
    {
      $$ = $2;
    }
  | atom
    {
      $$ = $1;
    }
  ;
%%