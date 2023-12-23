// Let x = 46 + (foo * bar)

export enum TokenType {
    String,
    Number,
    Identifier,
    Equals,
    BinaryOp,
    Fn,
    Let,
    Const,
    If,
    Else,
    For,
    While,
    Greater,
    Lesser,
    EqualsCompare,
    NotEqualsCompare,
    GreaterEqual,
    LesserEqual,
    Exclamation,
    And,
    Bar,
    Dot,
    Quote,
    Comma, 
    Colon,
    OpenBrace,      // {
    CloseBrace,     // }
    OpenParen,      // (
    CloseParen,     // )
    OpenBracket,    // [
    CloseBracket,   // ]
    Semicolon,
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const: TokenType.Const,
    fn: TokenType.Fn,
    if: TokenType.If,
    else: TokenType.Else,
    for: TokenType.For,
    while: TokenType.While,
}

export interface Token {
    value: string, 
    type: TokenType,
}

function token(value = "", type: TokenType): Token {
    return {value, type};
}

function isskippable(str: string) {
    return str == ' ' || str == '\n' || str == '\t' || str == '\r';
}


function isalpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isint(str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}

export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // build each token until EOF
    // TODO: need to make more memory efficient
    while(src.length > 0) {
        if(src[0] == '(') 
            tokens.push(token(src.shift(), TokenType.OpenParen));
        else if (src[0] == ')') 
            tokens.push(token(src.shift(), TokenType.CloseParen));
        else if (src[0] == '{') 
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        else if (src[0] == '}') 
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        else if (src[0] == '[') 
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        else if (src[0] == ']') 
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        else if (src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%') 
            tokens.push(token(src.shift(), TokenType.BinaryOp));
        else if (src[0] == '=') {
            src.shift()
            if (src[0] == '=') {
                src.shift()
                tokens.push(token('==', TokenType.EqualsCompare));
            } else {
                tokens.push(token("=", TokenType.Equals));
            }
        }
        else if (src[0] == ';')
            tokens.push(token(src.shift(), TokenType.Semicolon));
        else if (src[0] == ',')
            tokens.push(token(src.shift(), TokenType.Comma));
        else if (src[0] == '.')
            tokens.push(token(src.shift(), TokenType.Dot));
        else if (src[0] == ':')
            tokens.push(token(src.shift(), TokenType.Colon));
        else if (src[0] == '>') {
            src.shift();
            if (String(src[0]) == '=') {
                src.shift()
                tokens.push(token(">=", TokenType.GreaterEqual));
            } else {
                tokens.push(token(">", TokenType.Greater));
            }
        }
        else if (src[0] == '<') {
            src.shift();
            if (String(src[0]) == '=') {
                src.shift()
                tokens.push(token("<=", TokenType.LesserEqual));
            } else {
                tokens.push(token("<", TokenType.Lesser));
            }
        }
        else if (src[0] == '!') {
            src.shift();
            if (String(src[0]) == '=') {
                src.shift()
                tokens.push(token("!=", TokenType.NotEqualsCompare));
            } else {
                tokens.push(token("!", TokenType.Exclamation));
            }
        }
        else if (src[0] == '|')
            tokens.push(token(src.shift(), TokenType.Bar));
        else if (src[0] == '"') {
            tokens.push(token(src.shift(), TokenType.Quote));
            while (src[0] !== '"')
                tokens.push(token(src.shift(), TokenType.String));
            tokens.push(token(src.shift(), TokenType.Quote));
        } else {
            // Handle mutlicharacter tokens
            
            // numbers
            if(isint(src[0])) {
                let n = "";
                while(src.length > 0 && isint(src[0])) {
                    n += src.shift();
                }

                tokens.push(token(n, TokenType.Number));
            } else if (isalpha(src[0])) { // alphabetic characters
                let ident = "";
                while(src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }
                
                // check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (typeof reserved == "number") {
                    tokens.push(token(ident, reserved));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if (isskippable(src[0])) {
                src.shift(); // SKIP THE CURRENT CHARACTER
            } else {
                console.log("Unrecognized character found in source: ", src[0]);
                Deno.exit(1);
            }

        }
    }
    
    tokens.push({type: TokenType.EOF, value: "EndOfFile"});
    return tokens;
}