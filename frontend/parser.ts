// deno-lint-ignore-file no-explicit-any
import process from 'node:process';
import {
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    Expr,
    Identifier,
    MemberExpr,
    NumericLiteral,
    StringLiteral,
    ObjectLiteral,
    Program,
    Property,
    Stmt,
    VarDeclaration,
    FunctionDeclaration,
    IfDeclaration,
    ForDeclaration
  } from "./ast.ts";
  
  import { Token, tokenize, TokenType } from "./lexer.ts";
  
  export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat() {
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
        console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
        process.exit(1);
        }

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
        kind: "Program",
        body: [],
        };

        // Parse until end of file
        while (this.not_eof()) {
        program.body.push(this.parse_stmt());
        }

        return program;
    }

    // Handle complex statement types
    private parse_stmt(): Stmt {
        // skip to parse_expr
        switch (this.at().type) {
        case TokenType.Let:
        case TokenType.Const:
            return this.parse_var_declaration();
        case TokenType.Fn:
            return this.parse_function_declaration();
        case TokenType.If:
            return this.parse_if_declaration();
        case TokenType.While:
            return this.parse_while_declaration();
        case TokenType.For:
            return this.parse_for_declaration();
        default:
            return this.parse_expr();
        }
    }

    parse_for_declaration(): Stmt {
        this.eat();
        this.expect(TokenType.OpenParen, "Expected open parenthesis (\"(\") expected following \"for\" keyword.");
        const init = this.parse_var_declaration();
        const cond = this.parse_expr();
        this.expect(TokenType.Semicolon, "Expected semicolon after initialization in \"for\" declaration");
        const step = this.parse_assignment_expr();
        this.expect(TokenType.CloseParen, "Closing parenthesis (\")\") expected following \"for\" statement.");
        const body = this.parse_block_statement();

        return {
            kind: "ForDeclaration", 
            init, 
            cond, 
            step, 
            body,
        } as ForDeclaration;
    }
    
    parse_block_statement(): Stmt[] {
        this.expect(TokenType.OpenBrace, "Opening brace (\"{\") expected while parsing code block.");

        const body: Stmt[] = [];

        while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
            const stmt = this.parse_stmt();
            body.push(stmt);
        }

        this.expect(TokenType.CloseBrace, "Closing brace (\"}\") expected while parsing code block.");

        return body;
    }
    
    parse_while_declaration(): Stmt {
      throw new Error("Method not implemented.");
    }

    parse_if_declaration(): Stmt {
        this.eat();
        this.expect(TokenType.OpenParen, "Expected open parenthesis (\"(\") expected following \"if\" keyword.");
        const cond = this.parse_expr();
        this.expect(TokenType.CloseParen, "Closing parenthesis (\")\") expected following \"if\" statement.");
        const body = this.parse_block_statement();

        let alternate: Stmt[];
        if (this.at().type == TokenType.Else) {
            this.eat(); // eat "else"

            if (this.at().type == TokenType.If) {
                alternate = [this.parse_if_declaration()];
            } else {
                alternate = this.parse_block_statement();
            }
            return {
                kind: 'IfDeclaration',
                body,
                cond,
                alt: alternate
            } as IfDeclaration;
        }

        return {
            kind: 'IfDeclaration',
            body,
            cond
        } as IfDeclaration;
        
    }

    parse_function_declaration(): Stmt {
        this.eat(); // eat fn keyword
        const name = this.expect(TokenType.Identifier, "Expected function name following fn keyword").value;

        const args = this.parse_args();
        const params: string[] = [];
        for (const arg of args) {
            if (arg.kind !== "Identifier") {
                console.log(arg);
                throw "Expected parameter to be of type string inside function declaration.";
            }

            params.push((arg as Identifier).symbol);
        }

        this.expect(TokenType.OpenBrace, "Expected function body following declaration.");

        const body: Stmt[] = [];

        while (this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parse_stmt());
        }

        this.expect(TokenType.CloseBrace, "Closing brace expected inside function declaration.");
        const fn = {
            body, name, parameters: params, kind: "FunctionDeclaration"
        } as FunctionDeclaration;

        return fn;
    }

    // LET IDENT;
    // ( LET | CONST ) IDENT = EXPR;
    parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(
        TokenType.Identifier,
        "Expected identifier name following let | const keywords."
        ).value;

        if (this.at().type == TokenType.Semicolon) {
        this.eat(); // expect semicolon
        if (isConstant) {
            throw "Must assign value to constant expression. No value provided.";
        }

        return {
            kind: "VarDeclaration",
            identifier,
            constant: false,
        } as VarDeclaration;
        }

        this.expect(
        TokenType.Equals,
        "Expected equals token following identifier in var declaration."
        );

        const declaration = {
        kind: "VarDeclaration",
        value: this.parse_expr(),
        identifier,
        constant: isConstant,
        } as VarDeclaration;

        this.expect(
        TokenType.Semicolon,
        "Variable declaration statment must end with semicolon."
        );

        return declaration;
    }

    // Handle expressions
    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();

        if (this.at().type == TokenType.Equals) {
            this.eat(); // advance past equals
            const value = this.parse_assignment_expr();
            return {
                value,
                assigne: left,
                kind: "AssignmentExpr",
            } as AssignmentExpr;
        }

        return left;
    }

    private parse_array_expr(): Expr {
        this.eat(); // advance past open bracket.
        const elements = new Array<Property>();
        let index = 0;
        while (this.not_eof() && this.at().type != TokenType.CloseBracket) {
            const element = this.parse_expr();
            elements.push({key: index.toString(), kind:"Property", value: element});
            index += 1;
            if (this.at().type != TokenType.CloseBracket) {
                this.expect(
                TokenType.Comma,
                "Expected comma or closing bracket following element"
                );
            }
        }
        this.expect(
            TokenType.CloseBracket,
            "Array Expression missing closing bracket."
        );
        return { kind: "ObjectLiteral", properties: elements } as ObjectLiteral;
    }

    private parse_object_expr(): Expr {
        // { Prop[] }
        if (this.at().type == TokenType.OpenBracket) {
            return this.parse_array_expr();
        } else if (this.at().type !== TokenType.OpenBrace) {
            return this.parse_additive_expr();
        }

        this.eat(); // advance past open brace.
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
        const key = this.expect(
            TokenType.Identifier,
            "Object literal key expected"
        ).value;

        // Allows shorthand key: pair -> { key, }
        if (this.at().type == TokenType.Comma) {
            this.eat(); // advance past comma
            properties.push({ key, kind: "Property" } as Property);
            continue;
        } // Allows shorthand key: pair -> { key }
        else if (this.at().type == TokenType.CloseBrace) {
            properties.push({ key, kind: "Property" });
            continue;
        }

        // { key: val }
        this.expect(
            TokenType.Colon,
            "Missing colon following identifier in ObjectExpr"
        );
        const value = this.parse_expr();

        properties.push({ kind: "Property", value, key });
        if (this.at().type != TokenType.CloseBrace) {
            this.expect(
            TokenType.Comma,
            "Expected comma or closing bracket following property"
            );
        }
        }

        this.expect(
        TokenType.CloseBrace,
        "Object literal missing closing brace."
        );
        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
    }

    // Handle Addition & Subtraction Operations
    private parse_additive_expr(): Expr {
        if (this.at().type == TokenType.Quote) {
            return this.parse_string_expr();
        }
        let left = this.parse_multiplicitave_expr();

        while (["+", "-", "==", "!=", "<", ">", "<=", ">=", "&&", "|"].includes(this.at().value)) {
            const operator = this.eat().value;
            const right = this.parse_multiplicitave_expr();
            left = {
                kind: "BinaryExpr",
                left, right, operator
            } as BinaryExpr
        }

        return left;
    }


    private parse_string_expr(): Expr {
        this.eat(); // advance past the first quotation
        let str = "";
        while (this.at().type !== TokenType.Quote) {
            str += this.eat().value;
        }
        this.eat(); // advance past the second quotation

        return {kind: "StringLiteral", value: str} as StringLiteral;        
    }

    // Handle Multiplication, Division & Modulo Operations
    private parse_multiplicitave_expr(): Expr {
        let left = this.parse_call_member_expr();

        while (
            this.at().value == "/" ||
            this.at().value == "*" ||
            this.at().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parse_call_member_expr();
            left = {
            kind: "BinaryExpr",
            left,
            right,
            operator,
            } as BinaryExpr;
        }

        return left;
    }

    // foo.x()()
    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr();

        if (this.at().type == TokenType.OpenParen) {
        return this.parse_call_expr(member);
        }

        return member;
    }

    private parse_call_expr(caller: Expr): Expr {
        let call_expr: Expr = {
        kind: "CallExpr",
        caller,
        args: this.parse_args(),
        } as CallExpr;

        if (this.at().type == TokenType.OpenParen) {
        call_expr = this.parse_call_expr(call_expr);
        }

        return call_expr;
    }

    private parse_args(): Expr[] {
        this.expect(TokenType.OpenParen, "Expected open parenthesis");
        const args =
        this.at().type == TokenType.CloseParen
            ? []
            : this.parse_arguments_list();

        this.expect(
        TokenType.CloseParen,
        "Missing closing parenthesis inside arguments list"
        );
        return args;
    }

    private parse_arguments_list(): Expr[] {
        const args = [this.parse_assignment_expr()];

        while (this.at().type == TokenType.Comma && this.eat()) {
        args.push(this.parse_assignment_expr());
        }

        return args;
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();

        while (
            this.at().type == TokenType.Dot ||
            this.at().type == TokenType.OpenBracket
            ) {
            const operator = this.eat();
            let property: Expr;
            let computed: boolean;

            // non-computed values aka obj.expr
            if (operator.type == TokenType.Dot) {
                computed = false;
                // get identifier
                property = this.parse_primary_expr();
                if (property.kind != "Identifier") {
                throw `Cannonot use dot operator without right hand side being a identifier`;
                }
            } else {
                // this allows obj[computedValue]
                computed = true;
                property = this.parse_expr();
                this.expect(
                TokenType.CloseBracket,
                "Missing closing bracket in computed value."
                );
            }

            object = {
                kind: "MemberExpr",
                object,
                property,
                computed,
            } as MemberExpr;
        }
        return object;
    }

    // Orders Of Prescidence
    // Assignment
    // Object
    // AdditiveExpr
    // MultiplicitaveExpr
    // Call
    // Member
    // PrimaryExpr

    // Parse Literal Values & Grouping Expressions
    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        // Determine which token we are currently at and return literal value
        switch (tk) {
        // User defined values.
        case TokenType.Identifier:
            return { kind: "Identifier", symbol: this.eat().value } as Identifier;

        // Constants and Numeric Constants
        case TokenType.Number:
            return {
            kind: "NumericLiteral",
            value: parseFloat(this.eat().value),
            } as NumericLiteral;
        
        case TokenType.String:
            return {
                kind: "StringLiteral",
                value: this.eat().value,
            } as StringLiteral;

        // Grouping Expressions
        case TokenType.OpenParen: {
            this.eat(); // eat the opening paren
            const value = this.parse_expr();
            this.expect(
            TokenType.CloseParen,
            "Unexpected token found inside parenthesised expression. Expected closing parenthesis."
            ); // closing paren
            return value;
        }

        // Unidentified Tokens and Invalid Code Reached
        default:
            console.error("Unexpected token found during parsing!", this.at());
            process.exit(1);
        }
    }
}