import { Conjunction, LLangAst, WorldModel } from "../machines-like-us/types.ts";
import { ast_node, noun_phrase } from "./ast-types.ts";
import { copulaToHas } from "./copulaToHas.ts";
import { expandModifiers } from "./expandModifiers.ts";
import { parse } from "./parse.ts";
import { wm } from './example-world-model.ts'
import { $, ExpBuilder } from "../machines-like-us/exp-builder.ts";
import { findAll } from "../machines-like-us/findAll.ts";

export function resImplRefs(
    asts: ast_node[],
    wm: WorldModel,
): [ast_node[], WorldModel] {

    return [
        asts.map(ast => oneStep(ast, wm)),
        wm,
    ]
}

function oneStep<T extends ast_node>(ast: ast_node, wm: WorldModel): T
function oneStep(ast: ast_node, wm: WorldModel): ast_node {

    switch (ast.type) {
        case 'noun-phrase':
            {
                const variable = `${ast.head}${generateRandom()}:${ast.head}` as const
                const query = astToQuery(ast, variable)
                const result = findAll(query.$, [$(variable).$], { wm, derivClauses: [] })
                let id: string

                if (result.length > 1 && !ast.pluralizer) {
                    throw new Error('ambiguous: multiple anaphoric matches!')
                } else if (result.length === 1) {
                    const map = result[0]
                    const match = map.get($(variable).$)
                    id = match?.value!
                } else if (!result.length) {
                    id = ast.head + generateRandom()
                    updateWorldModel(ast, wm, id)
                }

                return {
                    type: 'noun-phrase',
                    head: id!,
                }
            }
        case 'copula-sentence':
            return {
                type: 'copula-sentence',
                subject: oneStep(ast.subject, wm),
                object: oneStep(ast.object, wm),
            }
        case 'has-sentence':
            return {
                type: 'has-sentence',
                subject: oneStep(ast.subject, wm),
                object: oneStep(ast.object, wm),
                role: oneStep(ast.role, wm),
            }

    }

    throw new Error('not implemented!')
}

function updateWorldModel(np: noun_phrase, wm: WorldModel, id: string) {

}

function astToQuery(ast: ast_node, variable: string): ExpBuilder<LLangAst> {

    switch (ast.type) {
        case 'noun-phrase':

            if (ast.modifiers) throw new Error('noun phrase has modifiers!')
            if (ast.owner !== undefined) throw new Error('noun phrase has owner!')

            {
                let query: ExpBuilder<LLangAst> = $(variable).isa(ast.head)

                if (ast.suchThat) {
                    query = query.and(astToQuery(ast.suchThat, variable) as ExpBuilder<Conjunction>)
                }

                return query
            }

        case 'has-sentence':
            return $(variable).has(ast.object.head).as(ast.role.head)

    }

    throw new Error('not implemented!')
}

function generateRandom() {
    return parseInt(100 * Math.random() + '')
}

const ast = copulaToHas(expandModifiers(parse('the red button')), wm)
// console.log(astToQuery(ast, 'button1:button'))
console.log(oneStep(ast, wm))
