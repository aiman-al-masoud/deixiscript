/**
 * rlwrap deno run main.ts
 */

import { evaluate } from "../core/evaluate.ts";
import { getStandardKb } from "../core/prelude.ts";
import { getParser } from "../parser/parser.ts";
import { cleanUpAst } from "./cleanUpAst.ts";
import { syntaxes } from "./grammar.ts";

const parser = getParser({ syntaxes: syntaxes })
let kb = getStandardKb()

while (true) {
    const x = prompt('> ')!
    const ast0 = parser.parse(x) as any
    // console.log(ast0)
    // const ast1 = 'f1' in ast0 ? ast0['f1'] : ast0
    const ast = cleanUpAst(ast0)
    console.log(ast)
    //TODO: command or question

    // console.log(ast)
    const isCommand = ast0.type === 'command'
    const result = evaluate({ ast, isCommand, kb })
    console.log('===>', result.result)
    kb = result.kb
}
