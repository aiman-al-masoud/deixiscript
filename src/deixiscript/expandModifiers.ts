import { and_sentence, ast_node, copula_sentence, sentence, } from './deixi-ast.ts'

export function expandModifiers<T extends ast_node>(ast: T): T
export function expandModifiers(ast: ast_node): ast_node {
    switch (ast.type) {

        case 'noun-phrase':

            if (!ast.modifiers) {
                return ast
            }

            const copulaSentences = ast.modifiers.map(m => makeCopular(m, ast.head))

            return {
                type: 'noun-phrase',
                head: ast.head,
                suchThat: makeAnd(copulaSentences) as sentence,
            }

        case 'copula-sentence':
            return {
                type: 'copula-sentence',
                subject: expandModifiers(ast.subject),
                object: expandModifiers(ast.object),
            }
        case 'verb-sentence':
            return {
                type: 'verb-sentence',
                subject: expandModifiers(ast.subject),
                object: ast.object ? expandModifiers(ast.object) : undefined,
                receiver: ast.receiver ? expandModifiers(ast.receiver) : undefined,
                verb: ast.verb,
            }
        case 'there-is-sentence':
            return {
                type: 'there-is-sentence',
                subject: expandModifiers(ast.subject),
            }
        case 'if-sentence':
            return {
                type :'if-sentence',
                condition : expandModifiers(ast.condition),
                consequence : expandModifiers(ast.consequence),
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

function makeAnd(sentences: sentence[]): sentence | and_sentence {

    if (sentences.length === 1) {
        return sentences[0]
    }

    return {
        type: 'and-sentence',
        first: sentences[0],
        second: makeAnd(sentences.slice(1))
    }

}

// const r = parse('the red big button is blue')
// console.log(r)
// const r2 = expandModifiers(r)
// console.log(r2)
