import { MemberExpr, Identifier } from "../frontend/ast.ts";
import { printValues } from "./eval/native-fns.ts";
import { MK_BOOL, MK_NULL, MK_NATIVE_FN, RuntimeVal, MK_NUMBER, ObjectVal } from "./values.ts";

export function createGlobalEnv() {
    const env = new Environment();
    // Create Default Global Environment
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

    // define a native methods
    env.declareVar(
        "print", 
        MK_NATIVE_FN((args) => {
            printValues(args);
            return MK_NULL();
        }), 
        true
    );

    function timeFunction (args: RuntimeVal[], env: Environment) {
        return MK_NUMBER(Date.now());
    }
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
    
    return env;
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor (parentENV?: Environment) {
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }

    public lookupOrMutObject(expr: MemberExpr, value?: RuntimeVal, property?: Identifier): RuntimeVal {
        if (expr.object.kind === 'MemberExpr') return this.lookupOrMutObject(expr.object as MemberExpr, value, expr.property as Identifier);

        const varname = (expr.object as Identifier).symbol;
        const env = this.resolve(varname);

        let pastVal = env.variables.get(varname) as ObjectVal;

        const prop = property
            ? property.symbol
            : (expr.property as Identifier).symbol;
        const currentProp = (expr.property as Identifier).symbol;

        if (value) pastVal.properties.set(prop, value);

        if (currentProp) pastVal = (pastVal.properties.get(currentProp) as ObjectVal);

        return pastVal;
    }

    public declareVar(
        varname: string, 
        value: RuntimeVal, 
        constant: boolean
    ) {
        if (this.variables.has(varname)) {
            throw `Cannot declare variable ${varname} as it's already defined.`
        }
        this.variables.set(varname, value);

        if (constant)
            this.constants.add(varname);
        return value;
    }

    public assignVar(
        varname: string, 
        value: RuntimeVal
    ): RuntimeVal {
        const env = this.resolve(varname);

        // Cannot assign to constant
        if (env.constants.has(varname)) {
            throw `Cannot reassign to variable ${varname} as it was declared constant.`;
        }
        
        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(
        varname: string
    ): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }
    
    public resolve(
        varname: string
    ): Environment {
        if (this.variables.has(varname))
            return this;
        if (this.parent == undefined)
            throw `Cannot resolve '${varname}' as it does not exist.`
        
        return this.parent.resolve(varname);
    }
}