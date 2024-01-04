import Parser from "./frontend/parser.ts";
import Environment, { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

import { readFileSync } from "node:fs";
import { transcribe } from "./utils/trans.ts";
import process from 'node:process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const file = process.argv[2];

if(file) {
    run(file);
} else {
    repl();
}

async function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnv();

    let input = readFileSync(filename, 'utf-8');

    if (filename.endsWith('.sc')) input = await transcribe(input);

    const program = parser.produceAST(input);
    const result = evaluate(program, env);

    console.log(result);
    process.exit();
}


async function repl() {
    const parser = new Parser();
    const env = createGlobalEnv();

    console.log("Repl v1.0 (schizo)");

    while (true) {
        const input = await rl.question("> ");

        // check for no user input or exit keyword.
        if (!input || input == "exit()") {
            process.exit(1);
        }

        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}