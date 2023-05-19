import { syntaxes } from "./config.ts"
import { getParser } from "./parser.ts"

export function toJs(ast: any, context: any, sideEfct = false): string {

    switch (ast.type) {
        case 'noun-phrase':
            if (sideEfct) {
                return `new ${ast.head}(${ast.modifiers})`
            }

            if (ast.owner) {
                return `${toJs(ast.owner, context)}.${ast.head}`
            }

            return ast.head // search

        case 'copula-sentence':

            if (sideEfct) {
                return `let ${toJs(ast.subject, context)} = ${toJs(ast.object, context, sideEfct = true)}`
            }

            return `${toJs(ast.subject, context)} == ${toJs(ast.object, context)}`

        case 'if-sentence':
            return `if(${toJs(ast.condition, context)}){
            ${toJs(ast.consequence, context, sideEfct = true)}
        }`
    }

    return ''
}

function compile(sourceCode: string) {

    let result = ''

    sourceCode.split('.').forEach(x => {
        const clean = x.trim()
        const ast = getParser(clean, syntaxes).parse()
        if (ast) result += toJs(ast, {}, true) + ';\n'
    })

    return result
}


// unless
// until
// whenever with setTimer
// before ... then ...

// const ast = getParser('x is a red button', syntaxes).parse()
// const ast = getParser('second row of third column of matrix', syntaxes).parse()
// const ast = getParser('if x is big then y is small', syntaxes).parse()
// const code = toJs(ast, {}, false)
// console.log(code)

const code = compile(`
x is a red button. 
if x is red then y is a big blue button.
color of x is green.
the red button is big.
if the color of x is blue then the address of john is buruf.
`)

console.log(code)
