# Schizospeak
> Schizospeak is an ongoing project

Schizospeak is an interface to create esoteric programming languages such as [LOLCODE](https://en.wikipedia.org/wiki/LOLCODE) and [Shakespeare](https://en.wikipedia.org/wiki/Shakespeare_Programming_Language).
Currently, all syntactical rules are due for changes. Lexical morphology is a low priorty as that only includes replacement of current words with the new semantics.

## Components
Schizospeak incorporates the following:
1. Lexer : Tokenizes the input
2. Parser : Converts the Tokenized input into a valid AST
3. Interpreter : Uses the AST to return a Runtime value

# Usage
Currently, the syntax of the language is mostly inspired by JavaScript with hints of Python and C.

## Expressions
Expressions in Schizospeak incorporate Assignment, Binary, Call, and Member expressions. These expressions are a subset of statements and the hierarchy follows like so:
```
Expressions
|   Assignment Expressions
    |   Member Expressions
    |   Object Expressions
    | Call Expressions
        |   Binary Expressions
```

### Assignment Expressions
Assignment expressions include all expressions. This means that an assignment expression can is recursive and only works if both lhs and rhs are of the same types, 
otherwise results in `null`. The following are valid assignment expressions:
```
x = (4 >= 2) && (3 % 1)
y = obj[23 / 4 % 6]
z = foo(obj.y - bar(foo(4 / y)))()
w = v = 4
```
The following is an invalid assignment expression:
```
x = (4 >= 2) && (3 % 1) + 6  # result: null
x = 3 &&                     # error
```

### Binary Expressions
Binary expressions include both numeric operators and boolean operators.
Here are a few valid binary expressions:
```
x != 1
x == 1
x && 1         # result: true if x == 1 else false
true == false  # result: false
true != false  # result: true
```
### Call Expressions
### Member Expressions

## Declarations
Declarations encompass variable, function, if, and for declarations. All declarations are subtypes of statements and include a specific keyword. The heirarchy is constant across all types:
```
Declarations
    |   Variable Declaration
    |   Function Declaration
    |   If Declaration
    |   For Declaration
```
### Variable Declaration
There are two variable declaration keywords: `let` and `const`, where `let` allows re-assignment of assigned identifier and `const` does not. Note that both keywords 
disallow re-assignments involving the same keywords.

The following are all valid declarations: 
```
let x = (obj.x + foo(12)) % 4;
let y = (12 / 4) * 3 % 7;
const z = -foo(obj.x);
```
The following are invalid declarations:
```
let x = 3;
let x = 4;
const y = 4;
y = 7;
```
### Function Declaration
`fn` keyword allows declaration of functions. The functions arguments support both `args` and `kwargs`. There is no return keyword, instead typing out the variable name at the end works just the same as `return "var"`.

Functions can also be returned by other functions:
```
fn makeAdder(offset) {
    fn add(x, y) {
        x + y + offset
    }

    add
}
```
### If Declaration
### For Declaration

## Identifier

## Literals
### Numeric Literal
### String Literal
### Object Literal
