/// <reference lib="dom" />
import { getStandardKb } from "../core/prelude.ts";
import { isLLangAst } from "../core/types.ts";
import { syntaxes } from "../frontend-v1/english.ts";
import { evaluate, init, processEvents } from "../io/types.ts";
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
);

(window as unknown as { [x: string]: unknown }).state = state;

let timeout = 0;

(function job() {
    state = processEvents(state)
    clearTimeout(timeout)
    timeout = setTimeout(job, 500)
})()

textArea.onkeydown = e => {
    if (e.key === 'Enter' && e.ctrlKey) {

        let ast = parser.parse(textArea.value)
        while (ast !== undefined) {

            if (!isLLangAst(ast)) {
                ast = parser.parse()
                continue
            }

            try {
                const r = evaluate(ast, state)
                state = r.state
                console.log(r.result)
                ast = parser.parse()
            } catch (e) {
                console.log(e)
                ast = parser.parse()
            }

        }

    }
}


