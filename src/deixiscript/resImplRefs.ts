import { Conjunction, LLangAst, WorldModel } from "../machines-like-us/types.ts";
import { ast_node, noun_phrase } from "./deixi-ast.ts";
import { $, ExpBuilder } from "../machines-like-us/exp-builder.ts";
import { findAll } from "../machines-like-us/findAll.ts";

export function resImpRefs<T extends ast_node>(ast: T, wm: WorldModel): T
export function resImpRefs(ast: ast_node, wm: WorldModel): ast_node {

    switch (ast.type) {
        case 'noun-phrase':
            const variable = `${ast.head}${generateRandom()}:${ast.head}` as const
            const query = astToQuery(ast, variable)
            const result = findAll(query.$, [$(variable).$], { wm, derivClauses: [] })
            let id: string

            if (!result.length) {
                id = ast.head + generateRandom()
                updateWorldModel(ast, wm, id)
            } else if (result.length === 1) {
                const map = result[0]
                const match = map.get($(variable).$)
                id = match?.value!
            } else if (result.length > 1 && !ast.pluralizer) {
                throw new Error('ambiguous: multiple anaphoric matches!')
            }

            return {
                type: 'noun-phrase',
                head: id!,
            }
        case 'copula-sentence':
            return {
                type: 'copula-sentence',
                subject: resImpRefs(ast.subject, wm),
                object: ast.object/* resImpRefs(ast.object, wm) */,
            }
        case 'has-sentence':
            return {
                type: 'has-sentence',
                subject: resImpRefs(ast.subject, wm),
                object: resImpRefs(ast.object, wm),
                role: resImpRefs(ast.role, wm),
            }
        case 'verb-sentence':
            return {
                type: 'verb-sentence',
                verb: ast.verb,
                subject: resImpRefs(ast.subject, wm),
                object: ast.object ? resImpRefs(ast.object, wm) : undefined,
                receiver: ast.receiver ? resImpRefs(ast.receiver, wm) : undefined,
            }
        case 'there-is-sentence':
            return {
                type: 'there-is-sentence',
                subject: resImpRefs(ast.subject, wm),
            }

    }

    throw new Error('not implemented!')
}

function updateWorldModel(np: noun_phrase, wm: WorldModel, id: string) {
    wm.push([id, np.head])

    switch (np.suchThat?.type) {
        case 'has-sentence':
            wm.push([id, np.suchThat.object.head, np.suchThat.role.head])
    }
}

function astToQuery(ast: ast_node, variable: string): ExpBuilder<LLangAst> {

    switch (ast.type) {
        case 'noun-phrase':

            if (ast.modifiers) throw new Error('noun phrase has modifiers!')
            if (ast.owner !== undefined) throw new Error('noun phrase has owner!')

            let query: ExpBuilder<LLangAst> = $(variable).isa(ast.head)

            if (ast.suchThat) {
                query = query.and(astToQuery(ast.suchThat, variable) as ExpBuilder<Conjunction>)
            }

            return query
        case 'has-sentence':
            return $(variable).has(ast.object.head).as(ast.role.head)
        case 'copula-sentence':
            return $(variable).isa(ast.object.head)
    }

    throw new Error('not implemented: ' + ast.type)
}

function generateRandom() {
    return parseInt(100 * Math.random() + '')
}

// const ast = copulaToHas(expandModifiers(parse('the red button')), wm)
// // const ast2 = parse('the button')
// // console.log(astToQuery(ast, 'button1:button'))
// console.log(resImpRefs(ast, wm))
// console.log(wm)
// console.log(resImpRefs(ast, wm))
