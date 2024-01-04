import { NumberVal, RuntimeVal, StringVal } from "./values.ts";
import { AssignmentExpr, BinaryExpr, CallExpr, ForDeclaration, FunctionDeclaration, Identifier, IfDeclaration, MemberExpr, NumericLiteral, ObjectLiteral, Program, Stmt, StringLiteral, VarDeclaration } from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_identifier, eval_binary_expr, eval_assignment, eval_object_expr, eval_call_expr, eval_member_expr } from "./eval/expressions.ts";
import { eval_for_declaration, eval_function_declaration, eval_if_declaration, eval_program, eval_var_declaration } from "./eval/statements.ts";



export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: (astNode as NumericLiteral).value,
        type: "number"
      } as NumberVal;
    case "StringLiteral":
      return {
        value: (astNode as StringLiteral).value,
        type: "string"
      } as StringVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case "CallExpr":
      return eval_call_expr(astNode as CallExpr, env);
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env);
    case "BinaryExpr":
      return eval_binary_expr(astNode as BinaryExpr, env);
    case "Program":
      return eval_program(astNode as Program, env);
    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env);
    case "FunctionDeclaration":
      return eval_function_declaration(astNode as FunctionDeclaration, env);
    case "IfDeclaration":
      return eval_if_declaration(astNode as IfDeclaration, env);
    case "ForDeclaration":
      return eval_for_declaration(astNode as ForDeclaration, env);
    case "MemberExpr":
      return eval_member_expr(env, astNode as MemberExpr);
    default:
      console.error("This AST Node has not yet been setup for interpretation.", astNode);
      process.exit(1);
  }
}
