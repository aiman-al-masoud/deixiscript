import { ast_node, copula_sentence, sentence, } from './ast-types.ts'
import { parse } from './parse.ts'

export function expandModifiers<T extends ast_node>(ast: T): T {
    switch (ast.type) {

        case 'noun-phrase':

            if (!ast.modifiers) {
                return ast
            }

            const copulaSentences = ast.modifiers.map(m => makeCopular(m, ast.head))

            return {
                ...ast,
                suchThat: makeAnd(copulaSentences),
                modifiers: undefined,
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

function makeAnd(sentences: sentence[]): ast_node {

    if (sentences.length === 1) {
        return sentences[0]
    }

    return {
        type: 'and-sentence',
        first: sentences[0],
        second: makeAnd(sentences.slice(1)) as sentence
    }

}

const r = parse('the red big button')
console.log(r)
const r2 = expandModifiers(r)
console.log(r2)
