import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, ObjectLiteral } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, NumberVal, MK_NULL, ObjectVal, NativeFnValue, FunctionValue, BoolVal, MK_BOOL, MK_NUMBER, StringVal, NullVal } from "../values.ts";

export function eval_binary_expr(
    binop: BinaryExpr, 
    env: Environment
    ): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type == "number" && rhs.type == "number") 
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);

    // One or both are null
    return MK_NULL();
}

export function eval_numeric_binary_expr(lhs: RuntimeVal, rhs: RuntimeVal, operator: string): RuntimeVal {

    if (operator === '!=') {
        return equals(lhs, rhs, false);
    } else if (operator === '==') {
        return equals(lhs, rhs, true);
    } else if (operator === '&&') {
        return equals(lhs, rhs, true);
    } else if (operator === '<=') {
        const llhs = lhs as BoolVal;
        const rrhs = rhs as BoolVal;
        return MK_BOOL(llhs.value <= rrhs.value);
    } else if (operator === '>=') {
        const llhs = lhs as BoolVal;
        const rrhs = rhs as BoolVal;
        return MK_BOOL(llhs.value >= rrhs.value);
    } else if (operator === '|') {
        const llhs = lhs as BoolVal;
        const rrhs = rhs as BoolVal;

        return MK_BOOL(llhs.value || rrhs.value);
    } else if (lhs.type === 'number' && rhs.type === 'number') {
        const llhs = lhs as NumberVal;
        const rrhs = rhs as NumberVal;

        switch (operator) {
            case "+":
                return MK_NUMBER(llhs.value + rrhs.value);
            case "-":
                return MK_NUMBER(llhs.value - rrhs.value);
            case "*":
                return MK_NUMBER(llhs.value * rrhs.value);
            case "/":
                return MK_NUMBER(llhs.value / rrhs.value);
            case "%":
                return MK_NUMBER(llhs.value % rrhs.value);
            case "<":
                return MK_BOOL(llhs.value < rrhs.value);
            case ">":
                return MK_BOOL(llhs.value > rrhs.value);
            default:
                throw `Unknown operator provided in operation: ${lhs}, ${rhs}.`
        }
    } else {
        return MK_NULL()
    }
}

function equals(lhs: RuntimeVal, rhs: RuntimeVal, strict: boolean): RuntimeVal {
    const compare = strict ? (a: any, b: any) => a === b : (a: any, b: any) => a !== b;

    switch (lhs.type) {
        case 'boolean':
            return MK_BOOL(compare((lhs as BoolVal).value, (rhs as BoolVal).value));
        case 'number':
            return MK_BOOL(compare((lhs as NumberVal).value, (rhs as NumberVal).value));
        case 'string':
            return MK_BOOL(compare((lhs as StringVal).value, (rhs as StringVal).value));
        case 'function':
            return MK_BOOL(compare((lhs as FunctionValue).body, (rhs as FunctionValue).body));
        case 'native-fn':
            return MK_BOOL(compare((lhs as NativeFnValue).call, (rhs as NativeFnValue).call));
        case 'null':
            return MK_BOOL(compare((lhs as NullVal).value, (rhs as NullVal).value));
        case 'object':
            return MK_BOOL(compare((lhs as ObjectVal).properties, (rhs as ObjectVal).properties));
        default:
            throw `RunTime: Unhandled type in equals function: ${lhs}, ${rhs}`
    }
}


export function eval_identifier(
    ident: Identifier, 
    env: Environment
    ): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function eval_assignments(
    node: AssignmentExpr, 
    env: Environment
    ): RuntimeVal {
    if (node.assigne.kind !== "Identifier") {
        throw `Invalid LHS inside expression ${JSON.stringify(node.assigne)}`;
    }
    
    const varname = (node.assigne as Identifier).symbol;
    return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(
    obj: ObjectLiteral, 
    env: Environment
    ): RuntimeVal {
    const object = {type: "object", properties: new Map()} as ObjectVal;
    for (const {key, value} of obj.properties) {
        const runtimeVal = (value == undefined) 
            ? env.lookupVar(key) 
            : evaluate(value, env);
        
        object.properties.set(key, runtimeVal);
    }
    return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): RuntimeVal {
    const args = expr.args.map((arg) => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (fn.type == "native-fn") {
        const result = (fn as NativeFnValue).call(args, env);

        return result;
    } 
    
    if (fn.type == "function") {
        const func = fn as FunctionValue;
        const scope = new Environment(func.declarationEnv);

        // Create the variables for the parameters list
        for (let i = 0; i<func.parameters.length; i++) {
            // TODO: Check the bounds here
            // verify arity of function
            const varname = func.parameters[i];
            scope.declareVar(varname, args[i], false);
        }

        let result: RuntimeVal = MK_NULL();
        // Evaluate the function body line by line
        for (const stmt of func.body) {
            result = evaluate(stmt, scope);
        }

        return result;
    }

    throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}