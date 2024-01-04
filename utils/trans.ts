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
        .replace_fr("init", ';')
        .replace_fr("be", '=')
        .replace_fr("cuh", 'let')
        .replace_fr("ight", 'const')
        .replace_fr("yeet", 'print')
        .replace_fr("weball", 'if')
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
        .replace(/\: number/g, '')
        .replace(/\: string/g, '')
        .replace(/\: object/g, '')
        .replace(/\: boolean/g, '')
}