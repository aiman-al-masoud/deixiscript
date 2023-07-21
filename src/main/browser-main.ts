/// <reference lib="dom" />
import { getStandardKb } from "../core/prelude.ts";
import { LLangAst } from "../core/types.ts";
import { syntaxes } from "../frontend-v1/grammar.ts";
import { evaluate, init } from "../io/types.ts";
import { getParser } from "../parser/parser.ts";

const textArea = document.createElement('textarea')
const root = document.createElement('div')
textArea.id = 'stdin'
root.id = 'root'

document.body.appendChild(textArea)
document.body.appendChild(root)

const parser = getParser({ syntaxes: syntaxes })

let state = init(
    getStandardKb(),
    root,
    document,
)

textArea.onkeydown = e => {
    if (e.key === 'Enter' && e.ctrlKey) {
        const ast = parser.parse(textArea.value) as LLangAst
        const r = evaluate(ast, state)
        state = r.state
        console.log(r.result)
    }
}


