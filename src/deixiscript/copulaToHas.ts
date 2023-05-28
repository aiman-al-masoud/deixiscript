import { $ } from '../machines-like-us/exp-builder.ts'
import { WorldModel } from '../machines-like-us/types.ts'
import { findAll } from '../machines-like-us/findAll.ts'
import { ast_node, copula_sentence, has_sentence } from './ast-types.ts'
import { parse } from './parse.ts'
import { wm } from './example-world-model.ts'


export function copulaToHas<T extends ast_node>(ast: T, wm: WorldModel): T
export function copulaToHas<T extends ast_node>(ast: copula_sentence, wm: WorldModel): copula_sentence | has_sentence
export function copulaToHas(ast: ast_node, wm: WorldModel): ast_node {
    switch (ast.type) {
        case 'copula-sentence':

            const query = $(ast.object.head).isa('s:thing')
                .and($(ast.subject.head).has('s:thing').as('r:thing'))

            const r = findAll(query.$, [$('s:thing').$, $('r:thing').$], { wm, derivClauses: [] })
            const role = r[0]?.get($('r:thing').$)?.value

            if (!role) {
                return ast
            }

            return {
                type: 'has-sentence',
                subject: {
                    head: ast.subject.head,
                    type: 'noun-phrase',
                },
                object: {
                    head: ast.object.head,
                    type: 'noun-phrase',
                },
                role: {
                    head: role,
                    type: 'noun-phrase',
                }
            }

        case 'noun-phrase':
            return {
                type: 'noun-phrase',
                head: ast.head,
                suchThat: copulaToHas(ast.suchThat!, wm),
            }
    }

    throw new Error('not implemented!')
}


console.log(copulaToHas(parse('the button is red'), wm))


