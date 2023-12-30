// deno-lint-ignore-file
import Parser from "./frontend/parser.ts";
import Environment, { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL } from "./runtime/values.ts";

// repl();
run("./test.txt");

async function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnv();

    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);
    const result = evaluate(program, env);
    console.log(result);
}

function repl () {
    const parser = new Parser();
    const env = createGlobalEnv();

    // REPL
    console.log("\nRepl v0.1");

    while (true) {
        const input = prompt("> ");
        // Check for no user input or exit keyword
        if (!input) {
            Deno.exit(1);
        } else if (input == "exit") {
            Deno.exit(0);
        }

        // Produce AST from source-code
        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}