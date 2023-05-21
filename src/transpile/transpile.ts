import { getParser } from '../parser/parser.ts'
import { AstNode } from '../parser/types.ts'
import { ast_node } from './ast-types.ts'
import { syntaxes } from './grammar.ts'

function parse(sourceCode: string): ast_node[] {

    const results: AstNode[] = []

    sourceCode.split('.').map(x => x.trim()).forEach(s => {
        const ast = getParser(s, syntaxes).parse()
        if (ast) {
            results.push(ast)
        }
    })

    return results as any
}


const res = parse(`
    the cat's fur is green. 
    the cat is big.
    the cat is a smart cat.
    if the cat is black then the dog is stupid.
    `)


// console.log()

if (res[0].type === 'copula-sentence') {
    console.log(res[0])
}