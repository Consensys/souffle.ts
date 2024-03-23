%{
/* tslint:disable */

const ast = require("../ast");
const utils = require("../utils")

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

%start program

%%

/**
 * Terminal symbols
 */
 
DECL:	"DECL_TOK";
FUNCTOR:	"FUNCTOR_TOK";
INPUT_DECL:	"INPUT_DECL_TOK";
OUTPUT_DECL:	"OUTPUT_DECL_TOK";
PRINTSIZE_DECL:	"PRINTSIZE_DECL_TOK";
LIMITSIZE_DECL:	"LIMITSIZE_DECL_TOK";
TYPE:	"TYPE_TOK";
COMPONENT:	"COMPONENT_TOK";
INSTANTIATE:	"INSTANTIATE_TOK";
NUMBER_TYPE:	"NUMBER_TYPE_TOK";
SYMBOL_TYPE:	"SYMBOL_TYPE_TOK";
OVERRIDE:	"OVERRIDE_TOK";
PRAGMA:	"PRAGMA_TOK";
PLAN:	"PLAN_TOK";
LATTICE:	"LATTICE_TOK";
INCLUDE:  "INCLUDE_TOK";
DEBUG_DELTA:	"DEBUG_DELTA_TOK";
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
 * Program
 */
program
  : unit
  {
    return $1;
  }
  ;

/**
 * Top-level Program Elements
 */
unit
  : %empty
    { $$ = []; }
  | unit directive_head
    {
      $$ = $1;
      $$.push(...$2);
    }
  | unit rule
    {
      $$ = $1;
      $$.push(...$2);
    }
  | unit fact
    {
      $$ = $1;
      $$.push($2);
    }
  | unit component_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | unit component_init
    {
      $$ = $1;
      $$.push($2);
    }
  | unit pragma
    {
      $$ = $1;
      $$.push($2);
    }
  | unit type_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | unit lattice_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | unit functor_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | unit relation_decl
    {
      $$ = $1;
      $$.push(...$2);
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
 * Type Declarations
 */
type_decl
  : TYPE IDENT SUBTYPE qualified_name
    {
      $$ = new ast.SubsetType($2, new ast.NamedType($4, @4), @$);
    }
  | TYPE IDENT EQUALS union_type_list
    {
      if ($4.length > 1) {
        $$ = new ast.UnionType($2, $4, @$);
      } else {
        utils.assert($4.length == 1);
        $$ = new ast.AliasType($2, $4[0], @$);
      }
    }
  | TYPE IDENT EQUALS record_type_list
    {
      $$ = new ast.RecordType($2, $4, @$);
    }
  | TYPE IDENT EQUALS adt_branch_list
    {
      $$ = new ast.AlgebraicDataType($2, $4, @$);
    }
    /* Deprecated Type Declarations */
  | NUMBER_TYPE IDENT
    {
      parseNYI(`Deprecated number type ${yytext}`);
    }
  | SYMBOL_TYPE IDENT
    {
      parseNYI(`Deprecated symbol type ${yytext}`);
    }
  | TYPE IDENT
    {
      parseNYI(`Deprecated sub type ${yytext}`);
    }
  ;

/* Attribute definition of a relation */
/* specific wrapper to ensure the err msg says "expected ',' or ')'" */
record_type_list
  : LBRACKET RBRACKET
    { $$ = []; }
  | LBRACKET non_empty_attributes RBRACKET
    {
      $$ = $2;
    }
  ;

/* Union type argument declarations */
union_type_list
  : qualified_name
    {
      $$ = [new ast.NamedType($1, @1)];
    }
  | union_type_list PIPE qualified_name
    {
      $$ = $1;
      $$.push(new ast.NamedType($3, @3));
    }
  ;

adt_branch_list
  : adt_branch
    {
      $$ = [$1];
    }
  | adt_branch_list PIPE adt_branch
    {
      $$ = $1;
      $$.push($3);
    }
  ;

adt_branch
  : IDENT LBRACE RBRACE
    {
      $$ = [$1, []];
    }
  | IDENT LBRACE non_empty_attributes RBRACE
    {
      $$ = [$1, $3];
    }
  ;

/**
 * Lattice Declarations
 */

lattice_decl
  : LATTICE IDENT LT GT LBRACE lattice_operator_list RBRACE
    {
      parseNYI(`Lattice decl ${yytext}`);
    }
  ;

lattice_operator_list
  :  lattice_operator COMMA lattice_operator_list
    {
      parseNYI(`Lattice operator list ${yytext}`);
    }
  | lattice_operator
    {
      parseNYI(`Lattice operator list ${yytext}`);
    }
  ;

lattice_operator
  : IDENT MAPSTO arg
    {
      parseNYI(`Lattice operator ${yytext}`);
    }
  ;

/**
 * Relations
 */

/**
 * Relation Declaration
 */
relation_decl
  : DECL relation_names attributes_list relation_tags dependency_list
    {
      $$ = [];

      for (const name of $2) {
        $$.push(new ast.Relation(name, $3, new Set($4), $5));
      }
    }
  | DECL IDENT[delta] EQUALS DEBUG_DELTA LPAREN IDENT[name] RPAREN relation_tags
    {
      parseNYI('Debug delta: ${yytext}');
    }
  ;

/**
 * Relation Names
 */
relation_names
  : IDENT
    {
      $$ = [$1];
    }
  | relation_names COMMA IDENT
    {
      $$ = $1;
      $$.push($3);
    }
  ;

/**
 * Attributes
 */
attributes_list
  : LPAREN RPAREN
    {
      $$ = [];
    }
  | LPAREN non_empty_attributes RPAREN
    {
      $$ = $2;
    }
  ;

non_empty_attributes
  : attribute
    {
      $$ = [$1];
    }
  | non_empty_attributes COMMA attribute
    {
      $$ = $1;
      $$.push($3);
    }
  ;

attribute
  : IDENT COLON qualified_name
    {
      $$ = [$1, new ast.NamedType($3, @3), false];
    }
  | IDENT COLON qualified_name LT GT
    {
      parseNYI("Attribute with <>: ${yytext}");
      $$ = [$1, new ast.NamedType($3, @3), true];
    }
  ;

/**
 * Relation Tags
 */
relation_tags
  : %empty
    { $$ = []; }
  | relation_tags OVERRIDABLE_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags INLINE_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags NO_INLINE_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags MAGIC_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags NO_MAGIC_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags BRIE_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags BTREE_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags BTREE_DELETE_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  | relation_tags EQREL_QUALIFIER
    {
      $$ = $1;
      $$.push($2);
    }
  /* Deprecated Qualifiers */
  | relation_tags OUTPUT_QUALIFIER
    {
      parseNYI(`Deprecated relation tag ${yytext}`);
    }
  | relation_tags INPUT_QUALIFIER
    {
      parseNYI(`Deprecated relation tag ${yytext}`);
    }
  | relation_tags PRINTSIZE_QUALIFIER
    {
      parseNYI(`Deprecated relation tag ${yytext}`);
    }
  ;

/**
 * Attribute Name List
 */
non_empty_attribute_names
  : IDENT
    {
      $$ = [$1];
    }

  | non_empty_attribute_names COMMA IDENT
    {
      $$ = $1;
      $$.push($3);
    }
  ;

/**
 * Functional Dependency Constraint
 */
dependency
  : IDENT
    {
      $$ = $1;
    }
  | LPAREN non_empty_attribute_names RPAREN
    {
      $$ = $2;
    }
  ;

dependency_list_aux
  : dependency
    {
      $$ = [$1];
    }
  | dependency_list_aux COMMA dependency
    {
      $$ = $1;
      $$.push($3);
    }
  ;

dependency_list
  : %empty
    { $$ = []; }
  | CHOICEDOMAIN dependency_list_aux
    {
      $$ = $2;
    }
  ;

/**
 * Datalog Rule Structure
 */

/**
 * Fact
 */
fact
  : atom DOT_TOK
    {
      $$ = new ast.Fact($1, @$);
    }
  ;

/**
 * Rule
 */
rule
  : rule_def
    {
      $$ = $1;
    }
  | rule_def query_plan
    {
      $$ = $1;
      for (const rule of $$) {
        rule.queryPlan = $2;
      }
    }
   | atom LE atom IF body DOT_TOK
    {
      $$ = [new ast.Subsumption($1, $3, $5, [], @$)];
    }
   | atom LE atom IF body DOT_TOK query_plan
    {
      $$ = [new ast.Subsumption($1, $3, $5, $7, @$)];
    }
  ;

/**
 * Rule Definition
 */
rule_def
  : head IF body DOT_TOK
    {
      $$ = [];
      for (const head of $1) {
        $$.push(new ast.Rule(head, $3, []))
      }
    }
  ;

/**
 * Rule Head
 */
head
  : atom
    {
      $$ = [$1];
    }
  | head COMMA atom
    {
      $$ = $1; $$.push($3);
    }
  ;

/**
 * Rule Body
 */
body
  : disjunction
    {
      $$ = new ast.Disjunction($1, @$);
    }
  ;

disjunction
  : conjunction
    {
      $$ = [new ast.Conjunction($1, @$)];
    }
  | disjunction SEMICOLON conjunction
    {
      $$ = $1;
      $$.push(new ast.Conjunction($3, @3));
    }
  ;

conjunction
  : term
    {
      $$ = [$1];
    }
  | conjunction COMMA term
    {
      $$ = $1;
      $$.push($3);
    }
  ;

/**
 * Terms in Rule Bodies
 */
term
  : atom
    {
      $$ = $1;
    }
  | constraint
    {
      $$ = $1;
    }
  | LPAREN disjunction RPAREN
    {
      $$ = new ast.Disjunction($2, @2);
    }
  | EXCLAMATION_TOK term
    {
      $$ = new ast.Negation($2, @$);
    }
  ;

/**
 * Rule body atom
 */
atom
  : IDENT LPAREN arg_list RPAREN
    {
      $$ = new ast.Atom($1, $3, @$);
    }
  /* This is a hack to work around a stupid R/R ambiguity in JISON. Probably cleaner ways to do this*/
  | IDENT DOT_TOK qualified_name LPAREN arg_list RPAREN
    {
      $$ = new ast.Atom(`${$1}.${$3}`, $5, @$);
    }
  ;

/**
 * Literal Constraints
 */
constraint
    /* binary infix constraints */
  : arg LT arg
    {
      $$ = new ast.Comparison($1, "<", $3, @$);
    }
  | arg GT arg
    {
      $$ = new ast.Comparison($1, ">", $3, @$);
    }
  | arg LE arg
    {
      $$ = new ast.Comparison($1, "<=", $3, @$);
    }
  | arg GE arg
    {
      $$ = new ast.Comparison($1, ">=", $3, @$);
    }
  | arg EQUALS arg
    {
      $$ = new ast.Comparison($1, "=", $3, @$);
    }
  | arg NE arg
    {
      $$ = new ast.Comparison($1, "!=", $3, @$);
    }

    /* binary prefix constraints */
  | TMATCH LPAREN arg COMMA arg RPAREN
    {
      $$ = new ast.StringConstraint("match", $3, $5, @$);
    }
  | TCONTAINS LPAREN arg COMMA arg RPAREN
    {
      $$ = new ast.StringConstraint("contains", $3, $5, @$);
    }

    /* zero-arity constraints */
  | TRUELIT
    {
      $$ = new ast.BoolLiteral(true, @$);
    }
  | FALSELIT
    {
      $$ = new ast.BoolLiteral(false, @$);
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
  | DOLLAR qualified_name LPAREN arg_list RPAREN
    {
      $$ = new ast.ADTLiteral($2, $4, @$);
    }
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

/**
 * Query Plan
 */
query_plan
  : PLAN query_plan_list
    {
      $$ = $1;
    };

query_plan_list
  : NUMBER COLON plan_order
    {
      $$ = [$1, $3];
    }
  | query_plan_list COMMA NUMBER COLON plan_order
    {
      $$ = $1;
      $$.push([$3, $5]);
    }
  ;

plan_order
  : LPAREN RPAREN
    {
      $$ = [];
    }
  | LPAREN non_empty_plan_order_list RPAREN
    {
      $$ = $2;
    }
  ;

non_empty_plan_order_list
  : NUMBER
    {
      $$ = [$1];
    }
  | non_empty_plan_order_list COMMA NUMBER
    {
      $$ = $1; $$.push($3);
    }
  ;

/**
 * Components
 */

/**
 * Component Declaration
 */
component_decl
  : component_head LBRACE component_body RBRACE
    {
      const [[name, typeParams], baseInvocations] = $1;

      $$ = new ast.Component(name, typeParams, baseInvocations, $3);
    }
  ;

/**
 * Component Head
 */
component_head
  : COMPONENT component_type
    {
      $$ = [$2, []];
    }
  | component_head COLON component_type
    {
      $$ = $1;
      $$[1].push($3);
    }
  | component_head COMMA component_type
    {
      $$ = $1;
      $$[1].push($3);
    }
  ;

/**
 * Component Type
 */
component_type
  : IDENT component_type_params
    {
      $$ = [$1, $2];
    };

/**
 * Component Parameters
 */
component_type_params
  : %empty
    { $$ = []; }
  | LT component_param_list GT
    {
      $$ = $2;
    }
  ;

/**
 * Component Parameter List
 */
component_param_list
  : IDENT
    {
      $$ = $1;
    }
  | component_param_list COMMA IDENT
    {
      $$ = $1;
      $$.push($3);
    }
  ;

/**
 * Component body
 */
component_body
  : %empty
    {
      $$ = [];
    }
  | component_body directive_head
    {
      $$ = $1;
      $$.push(...$2);
    }
  | component_body rule
    {
      $$ = $1;
      $$.push($2);
    }
  | component_body fact
    {
      $$ = $1;
      $$.push($2);
    }
  | component_body OVERRIDE IDENT
    {
      $$ = $1;
      $$.push(new ast.Override($3, @3));
    }
  | component_body component_init
    {
      $$ = $1;
      $$.push($2);
    }
  | component_body component_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | component_body type_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | component_body lattice_decl
    {
      $$ = $1;
      $$.push($2);
    }
  | component_body relation_decl
    {
      $$ = $1;
      $$.push(...$2);
    }
  ;

/**
 * Component Initialisation
 */
component_init
  : INSTANTIATE IDENT EQUALS component_type
    {
      $$ = new ast.ComponentInit($2, $4, @$);
    }
  ;

/**
 * User-Defined Functors
 */

/**
 * Functor declaration
 */
functor_decl
  : FUNCTOR IDENT LPAREN functor_arg_type_list RPAREN COLON qualified_name
    {
      $$ = new ast.Functor($2, $4, new ast.NamedType($7, @7), false, @$);
    }
  | FUNCTOR IDENT LPAREN functor_arg_type_list RPAREN COLON qualified_name STATEFUL
    {
      $$ = new ast.Functor($2, $4, new ast.NamedType($7, @7), true, @$);
    }
  ;

/**
 * Functor argument list type
 */
functor_arg_type_list
  : %empty
  { 
    $$ = [];
  }
  | non_empty_functor_arg_type_list
    {
      $$ = $1;
    }
  ;

non_empty_functor_arg_type_list
  : functor_attribute
    {
      $$ = [$1];
    }
  | non_empty_functor_arg_type_list COMMA functor_attribute
    {
      $$ = $1; $$.push($3);
    }
  ;

functor_attribute
  : qualified_name
    {
      $$ = ["", new ast.NamedType($1, @1)];
    }
  | IDENT COLON qualified_name
    {
      $$ = [$1, new ast.NamedType($3, @3)];
    }
  ;

/**
 * Other Directives
 */

/**
 * Pragma Directives
 */
pragma
  : PRAGMA STRING STRING
    {
      $$ = new ast.Pragma($2, $3, @$);
    }
  | PRAGMA STRING
    {
      $$ = new ast.Pragma($2, undefined, @$);
    }
  ;

/**
 * Directives
 */
directive_head
  : directive_head_decl directive_list
    {
      $$ = $2.map(([name, args]) => 
        new ast.Directive($1, name, args)
      )
    }
  ;

directive_head_decl
  : INPUT_DECL
    {
      $$ = yytext;
    }
  | OUTPUT_DECL
    {
      $$ = yytext;
    }
  | PRINTSIZE_DECL
    {
      $$ = yytext;
    }
  | LIMITSIZE_DECL
    {
      $$ = yytext;
    }
  ;

/**
 * Directive List
 */
directive_list
  : relation_directive_list
    {
      $$ = $1.map((x) => [x, []]);
    }
  | relation_directive_list LPAREN RPAREN
    {
      $$ = $1.map((x) => [x, []]);
    }
  | relation_directive_list LPAREN non_empty_key_value_pairs RPAREN
    {
      $$ = $1.map((x) => [x, [...$3]]);
    }
  ;

/**
 * Directive List
 */
relation_directive_list
  : qualified_name
    {
      $$ = [ $1 ];
    }
  | relation_directive_list COMMA qualified_name
    {
      $$ = $1;
      $$.push($3);
    }
  ;

/**
 * Key-value Pairs
 */
non_empty_key_value_pairs
  : IDENT EQUALS kvp_value
    {
      $$ = [[$1, $3]];
    }
  | non_empty_key_value_pairs COMMA IDENT EQUALS kvp_value
    {
      $$ = $1;
      $$.push([$3, $5]);
    }
  ;

kvp_value
  : STRING
    {
      $$ = new ast.StringLiteral($1.slice(1, -1), @$);
    }
  | IDENT
    {
      $$ = new ast.Identifier($1, @$);
    }
  | NUMBER
    {
      $$ = new ast.Num($1, @$);
    }
  | TRUELIT
    {
      $$ = new ast.BoolLiteral(true, @$);
    }
  | FALSELIT
    {
      $$ = new ast.BoolLiteral(false, @$);
    }
  ;

%%