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

function oneStep(ast: ast_node, wm: WorldModel): ast_node {

    findNounPhrases(ast).forEach(np => {

        const variable = `${np.head}${generateRandom()}:${np.head}` as const
        const query = makeQuery(np, variable)
        const result = findAll(query.$, [$(variable).$], { wm, derivClauses: [] })

        if (result.length > 1 && !np.pluralizer) {
            throw new Error('ambiguous: multiple anaphoric matches!')
        } else if (result.length === 1) {
            const map = result[0]
            const match = map.get($(variable).$)

        } else if (!result.length) {
            updateWorldModel(np, wm)
        }

        // return nounphrase with explicit reference

    })

}

function updateWorldModel(np: noun_phrase, wm: WorldModel) {

}

function findNounPhrases(ast: ast_node): noun_phrase[] {
    throw new Error('not implemented error!')
}

function makeQuery(ast: ast_node, variable: string): ExpBuilder<LLangAst> {

    switch (ast.type) {
        case 'noun-phrase':

            if (ast.modifiers) throw new Error('noun phrase has modifiers!')
            if (ast.owner !== undefined) throw new Error('noun phrase has owner!')

            {
                let query: ExpBuilder<LLangAst> = $(variable).isa(ast.head)

                if (ast.suchThat) {
                    query = query.and(makeQuery(ast.suchThat, variable) as ExpBuilder<Conjunction>)
                }

                return query
            }

        case 'has-sentence':
            return $(variable).has(ast.object.head).as(ast.role.head)

    }

    throw new Error('not implemented!')
}


const ast = copulaToHas(expandModifiers(parse('the red button')), wm)
console.log(makeQuery(ast))


function generateRandom() {
    return parseInt(100 * Math.random() + '')
}