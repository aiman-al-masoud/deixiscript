/**
 * rlwrap deno run main.ts
 */

import { evaluate } from "../core/evaluate.ts";
import { getStandardKb } from "../core/prelude.ts";
import { getParser } from "../parser/parser.ts";
import { syntaxes } from "./grammar.ts";

const parser = getParser({ syntaxes: syntaxes })
let kb = getStandardKb()

while (true) {
    const x = prompt('> ')!
    const ast0 = parser.parse(x) as any
    const ast1 = ast0.type === 'command' || ast0.type === 'question' ? ast0['f1'] : ast0
    const isCommand = ast0.type === 'command'
    const ast = ast1
    console.log(ast)
    const result = evaluate({ ast, isCommand, kb })
    console.log('===>', result.result)
    kb = result.kb
}
