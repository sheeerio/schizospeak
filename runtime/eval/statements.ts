import { FunctionDeclaration, IfDeclaration, Program, Stmt, VarDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL, FunctionValue, BoolVal } from "../values.ts";

export function eval_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }
    return lastEvaluated;
}


export function eval_var_declaration(
    declaration: VarDeclaration, 
    env: Environment
): RuntimeVal {
    
    const value = declaration.value 
    ? evaluate(declaration.value, env) 
    : MK_NULL();

    return env.declareVar(declaration.identifier, value, declaration.constant);    
}

export function eval_function_declaration(
    declaration: FunctionDeclaration, 
    env: Environment
): RuntimeVal {
    
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body,
    } as FunctionValue;

    return env.declareVar(declaration.name, fn, true);
}
  
export function eval_if_declaration(declaration: IfDeclaration, env: Environment) {
    const cond = evaluate(declaration.cond, env);

    if ((cond as BoolVal).value == true) {
        return eval_body(declaration.body, env);
    } else if (declaration.alt) {
        return eval_body(declaration.alt, env);
    } else {
        return MK_NULL();
    }
}

function eval_body(body: Stmt[], env: Environment, newEnv = true): RuntimeVal {
    let scope: Environment;

    if (newEnv) {
        scope = new Environment(env);
    } else {
        scope = env;
    }
    let result: RuntimeVal = MK_NULL();

    // Evaluate the if body line by line
    for (const stmt of body) {
        // if((stmt as Identifier).symbol === 'continue') return result;
        result = evaluate(stmt, scope);
    }

    return result;
}
