import { readFileSync } from "node:fs";
import axios from 'axios';

// fuck off typescript
declare global {
    interface String {
        replace_fr(target: string, replacement: string): string;
    }
}

String.prototype.replace_fr = function (target: string, replacement: string): string {
    const pattern = new RegExp('(?<![\'"`])\\b' + target + '\\b(?!["\'`])', 'g');
    
    return this.replace(pattern, replacement);
}


export async function transcribe(code: string) {
    return code
        .replace_fr("ok", ';')
        .replace_fr("ight", ';')
        .replace_fr("is", '=')
        .replace_fr("so", '')
        .replace_fr("now", '')
        .replace_fr("and", '')
        .replace_fr("loop from", 'for(let i=')
        .replace_fr("till", '; i<')
        .replace_fr("uptil", '; i<=')
        .replace_fr("stepping normally", ';i = i+1) {')
        .replace_fr("run", '}')
        .replace_fr("then", '')
        .replace_fr("first", 'let')
        .replace_fr("let's say that", 'let')
        .replace_fr("let's also say that", 'let')
        .replace_fr("new line", '"\n"')
        .replace_fr("let's print", 'print(')
        .replace_fr("ight", 'const')
        .replace_fr("nice", ')')
        .replace_fr('perfect', ')')
        .replace_fr("what about", 'print(')
        .replace_fr("say", 'print(')
        .replace_fr("mood", 'null')
        .replace_fr("fuckit", 'else')
        .replace_fr("opp", '!=')
        .replace_fr("bet", '==')
        .replace_fr("cap", '&&')
        .replace_fr("yuhyuh", '|')
        .replace_fr("mfw", 'fn')
        .replace_fr("virgin", 'math')
        .replace_fr("ayo", 'for')
        .replace_fr("lowkey", '<')
        .replace_fr("highkey", '>')
        .replace_fr("zesty", 'true')
        .replace_fr("sus", 'false')
}