import { readFileSync } from "node:fs";
import axios from 'axios';

// fuck off typescript
declare global {
    interface String {
        replace_fr(target: string, replacement: string): string;
    }
}

interface Currency {
    code: string;
    currency: {
        symbol: string,
    };
    language: {
        code: string,
    };
}

String.prototype.replace_fr = function (target: string, replacement: string): string {
    const pattern = new RegExp('(?<![\'"`])\\b' + target + '\\b(?!["\'`])', 'g');
    
    return this.replace(pattern, replacement);
}


export async function transcribe(code: string) {

    return code
        .replace_fr(";", '!')
        .replace_fr("innit", ';')
        .replace_fr("be", '=')
        .replace_fr("lit", 'let')
        .replace_fr("mf", 'const')
        .replace_fr("waffle", 'println')
        .replace_fr("sus", 'if')
        .replace_fr("fake", 'null')
        .replace_fr("impostor", 'else')
        .replace_fr("nah", '!=')
        .replace_fr("fr", '==')
        .replace_fr("btw", '&&')
        .replace_fr("carenot", '|')
        .replace_fr("bruh", 'fn')
        .replace_fr("nerd", 'math')
        .replace_fr("yall", 'for')
        .replace_fr("smol", '<')
        .replace_fr("thicc", '>')
        .replace_fr("nocap", 'true')
        .replace_fr("cap", 'false')
        .replace_fr("fuck_around", 'try')
        .replace_fr("find_out", 'catch')
        .replace_fr("clapback", 'exec')
        .replace_fr("yap", 'input')
        .replace(/\: number/g, '')
        .replace(/\: string/g, '')
        .replace(/\: object/g, '')
        .replace(/\: boolean/g, '')
}