/**
 * rlwrap deno run main.ts
 */

import { evaluate } from "../core/evaluate.ts";
import { getStandardKb } from "../core/prelude.ts";
import { LLangAst } from "../core/types.ts";
import { getParser } from "../parser/parser.ts";
import { syntaxes } from "./grammar.ts";

const parser = getParser({ syntaxes: syntaxes })
let kb = getStandardKb()

while (true) {
    const x = prompt('> ')!
    const ast = parser.parse(x) as LLangAst
    const result = evaluate(ast, kb)
    console.log('===>', result.result)
    kb = result.kb
}
