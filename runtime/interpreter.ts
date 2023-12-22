import {NumberVal, RuntimeVal, StringVal} from "./values.ts"
import {AssignmentExpr, BinaryExpr, CallExpr, FunctionDeclaration, Identifier, NumericLiteral, ObjectLiteral, Program, Stmt, StringLiteral, VarDeclaration} from "../frontend/ast.ts"
import Environment from "./environment.ts";
import { eval_identifier, eval_binary_expr, eval_assignments, eval_object_expr, eval_call_expr } from "./eval/expressions.ts";
import { eval_function_declaration, eval_program, eval_var_declaration } from "./eval/statements.ts";


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
            return eval_assignments(astNode as AssignmentExpr, env);
        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);
        case "Program":
            return eval_program(astNode as Program, env);
        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);
        case "FunctionDeclaration":
            return eval_function_declaration(astNode as FunctionDeclaration, env);
        default:
            console.error("This AST Node has not yet been setup for interpretation.", astNode);
            Deno.exit(1);       
    }
}