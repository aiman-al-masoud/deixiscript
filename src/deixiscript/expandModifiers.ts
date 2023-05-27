import { ast_node, copula_sentence, } from './ast-types.ts'
import { parse } from './parse.ts'

export function expandModifiers<T extends ast_node>(ast: T): T {

    switch (ast.type) {
        case 'noun-phrase':

            if (!ast.modifiers) {
                return ast
            }

            {
                const x = ast.modifiers.map(m => makeCopular(m, ast.head))

                if (x.length === 1) {

                    return {
                        ...ast,
                        suchThat: x[0],
                        modifiers: undefined,
                    }

                }

                throw new Error('not implemented!')
            }
        case 'copula-sentence':
            return {
                ...ast,
                subject: expandModifiers(ast.subject),
                object: expandModifiers(ast.object),
            }
    }

    throw new Error('not implemented!')

}

function makeCopular(modifier: string, head: string): copula_sentence {
    return {
        type: 'copula-sentence',
        subject: {
            head,
            type: 'noun-phrase',
        },
        object: {
            head: modifier,
            type: 'noun-phrase'
        }
    }
}

// function makeAnd(sentences: sentence[]): and_sentence {

const r = parse('the red button')
console.log(r)
const r2 = expandModifiers(r)
console.log(r2)
