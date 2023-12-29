// deno-lint-ignore-file no-empty-interface
export type NodeType = 
    // STATEMENTS
    | "Program" 
    | "VarDeclaration"
    | "IfDeclaration"
    | "ForDeclaration"
    | "FunctionDeclaration"
    // EXPRESSIONS
    | "AssignmentExpr"
    | "MemberExpr"
    | "CallExpr"
    // Literals
    | "Property"
    | "ObjectLiteral"
    | "NumericLiteral"
    | "StringLiteral"
    | "Identifier" 
    | "BinaryExpr";

// Note: Statements will not return a value
// let x = 45 will not return 45. 
// Expressions will return the value
// x = 45 will return 45
export interface Stmt {
    kind: NodeType;
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    constant: boolean,
    identifier: string,
    value?: Expr;
}


export interface FunctionDeclaration extends Stmt {
    kind: "FunctionDeclaration";
    parameters: string[];
    name: string;
    body: Stmt[];
}

export interface ForDeclaration extends Stmt {
    kind: "ForDeclaration";
    init: VarDeclaration;
    cond: Expr;
    step: AssignmentExpr;
    body: Stmt[];
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assigne: Expr;
    value: Expr;
}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string;
}

// foo.bar()
// foo["bar"]()
// foo[returnFoo()]()
export interface CallExpr extends Expr {
    kind: "CallExpr";
    args: Expr[];
    caller: Expr;
}

export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

export interface StringLiteral extends Expr {
    kind: "StringLiteral";
    value: string;
}


export interface Property extends Expr {
    kind: "Property";
    key: string;
    value?: Expr;
}

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: Property[];
}


export interface IfDeclaration extends Expr {
    kind: "IfDeclaration";
    cond: Expr;
    body: Stmt[];
    alt?: Stmt[];
}