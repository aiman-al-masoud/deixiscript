import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { Anaphor, DerivationClause, KnowledgeBase, LLangAst, isAnaphor, isIsASentence } from "./types.ts";
import { random } from "../utils/random.ts"
import { ArbitraryType } from "./types.ts"
import { ask } from "./ask.ts";


export function removeAnaphors(ast: Anaphor, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): ArbitraryType
export function removeAnaphors<T extends LLangAst>(ast: T, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): T
export function removeAnaphors<T extends LLangAst>(ast: T, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): T
export function removeAnaphors(ast: LLangAst, kb0 = $.emptyKb, oldArbiTypes: ArbitraryType[] = []): LLangAst {

    if (ast.type === 'anaphor') {

        const head = $(`x${random()}:${ast.headType}`).$
        let arbiType: ArbitraryType

        // const cands = kb0.wm.filter(isIsASentence).filter(x=>x[1]===ast.headType).map(x=>x[0])
        // console.log(cands, head)

        if (ast.whose && ast.whose.t1.type === 'entity') {
            const owned = $(`y${random()}:${ast.whose.t1.value}`).$

            const description = $(owned).exists.where($(head).has(owned)
                .and(subst(ast.whose, [ast.whose.t1, owned])))
                .$

            arbiType = { description, head, type: 'arbitrary-type' }
        } else if (ast.which) {
            const description = subst(ast.which, [$._.$, head])
            arbiType = { description: removeAnaphors(description, kb0, oldArbiTypes), head, type: 'arbitrary-type' }
        } else {
            arbiType = { description: $(true).$, head, type: 'arbitrary-type' }
        }

        // console.log(oldArbiTypes)
        // console.log(arbiType)
        const maybe = searchArbiType(arbiType, kb0, oldArbiTypes) //storedeixis=false
        // console.log(kb0, maybe)
        // console.log(maybe)
        // if (maybe !== undefined) console.log(maybe)
        return maybe ?? arbiType

    } else if (ast.type !== 'derivation-clause') {
        const anaphors = findAsts(ast, 'anaphor') as Anaphor[]
        const subs = anaphors.map(x => [x, removeAnaphors(x, kb0, oldArbiTypes)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast

        // console.log(findAsts(ast, 'anaphor').length)
        const result = subst(ast, ...subs)
        // console.log(findAsts(result, 'anaphor').length)

        return result
    }

    const conseqAnaphors = Object.values(ast.conseq).filter(isAnaphor) // maybe use findAst()
    const conseqArbiTypes = conseqAnaphors.map(x => removeAnaphors(x, kb0, oldArbiTypes))

    const kb = conseqArbiTypes.reduce(
        (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
        // $.emptyKb,
        kb0,
    )

    // console.log(kb)

    const whenAnaphors = findAsts(ast.when, 'anaphor')
    const whenArbiTypes = whenAnaphors.map(x => removeAnaphors(x, kb, [...oldArbiTypes, ...conseqArbiTypes]))
    // console.log(whenAnaphors)
    // console.log(whenArbiTypes)

    const whenReplacements = whenArbiTypes.map((x, i) => {
        return searchArbiType(x, kb, conseqArbiTypes) ?? x
        // const v = $('varname:thing').$
        // const query = $(x.head).suchThat($(x.description).and($(x.head).has(v).as('var-name'))).$
        // const result = ask(query, kb).result
        // const e2 = conseqArbiTypes.filter(x => x.head.value === result.value).at(0)
        // return e2 ?? x // whenArbiTypes[i]
    })

    const newConseq = conseqArbiTypes.reduce(
        (f, ab, i) => subst(f, [conseqAnaphors[i], ab]),
        ast.conseq,
    )

    const newWhen = whenReplacements.reduce(
        (f, v, i) => subst(f, [whenAnaphors[i], v]),
        ast.when,
    )

    const result: DerivationClause = {
        type: 'derivation-clause',
        conseq: newConseq,
        when: newWhen,
    }

    return result

}

function searchArbiType(x: ArbitraryType, kb: KnowledgeBase, conseqArbiTypes: ArbitraryType[]) {
    const v = $('varname:thing').$
    const query = $(v).suchThat($(x.head).exists.where($(x.description).and($(x.head).has(v).as('var-name')))).$
    const result = ask(query, kb).result



    const e2 = conseqArbiTypes.filter(x => x.head.value === result.value).at(0)

    // console.log('query=', query)
    // console.log('e2=', e2)
    // console.log('wm=', kb.wm)
    // console.log('------------------')

    // if (e2!==undefined) console.log(e2)

    return e2 //?? x // whenArbiTypes[i]
}



// function anaphorToArbitraryType(ast: Anaphor): ArbitraryType
// function anaphorToArbitraryType<T extends LLangAst>(ast: T): T
// function anaphorToArbitraryType<T extends LLangAst>(ast: T): T
// function anaphorToArbitraryType(ast: LLangAst): LLangAst {

//     if (ast.type !== 'anaphor') {
//         const anaphors = findAsts(ast, 'anaphor')
//         const anaphorsToArbi = anaphors.map(x => [x, anaphorToArbitraryType(x)] as [LLangAst, LLangAst])
//         if (anaphorsToArbi.length === 0) return ast
//         const result = subst(ast, ...anaphorsToArbi)
//         return result
//     }

//     const head = $(`x${random()}:${ast.headType}`).$

//     if (ast.whose && ast.whose.t1.type === 'entity') {
//         const owned = $(`y${random()}:${ast.whose.t1.value}`).$

//         const description = $(owned).exists.where($(head).has(owned)
//             .and(subst(ast.whose, [ast.whose.t1, owned])))
//             .$

//         return { description, head, type: 'arbitrary-type' }
//     }

//     if (ast.which) {
//         const description = subst(ast.which, [$._.$, head])
//         // if (description.t1.type === 'anaphor') description.t1 = $('x:panel').$
//         // console.log(description)
//         return { description: anaphorToArbitraryType(description), head, type: 'arbitrary-type' }
//     }

//     // console.log('head=', head)
//     return { description: $(true).$, head, type: 'arbitrary-type' }
// }