/**
 * rlwrap deno run main.ts
 */

import { evaluate } from "../core/evaluate.ts";
import { getStandardKb } from "../core/prelude.ts";
import { isLLangAst } from "../core/types.ts";
import { syntaxes } from "../frontend-v1/english.ts";
import { getParser } from "../parser/parser.ts";

const parser = getParser({ syntaxes: syntaxes })
let kb = getStandardKb()

while (true) {
    const x = prompt('> ')!
    const ast = parser.parse(x)
    if (!isLLangAst(ast)) continue
    const result = evaluate(ast, kb)
    console.log('===>', result.result)
    kb = result.kb
}
