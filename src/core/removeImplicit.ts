import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { ImplicitReference, DerivationClause, KnowledgeBase, LLangAst, isLLangAst } from "./types.ts";
import { random } from "../utils/random.ts"
import { ArbitraryType } from "./types.ts"
import { ask } from "./ask.ts";


export function removeImplicit(ast: ImplicitReference, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): ArbitraryType
export function removeImplicit<T extends LLangAst>(ast: T, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): T
export function removeImplicit(
    ast: LLangAst,
    kb0 = $.emptyKb,
    oldArbiTypes: ArbitraryType[] = [],
): LLangAst {

    if (ast.type === 'implicit-reference') {

        const head = $(`x${random()}:${ast.headType}`).$
        let arbiType: ArbitraryType

        if (ast.whose) {
            if (ast.whose.subject.type !== 'entity') throw new Error('')

            const owned = $(`y${random()}:${ast.whose.subject.value}`).$

            const description = $(owned).exists.where($(head).has(owned)
                .and(subst(ast.whose, [ast.whose.subject, owned])))
                .$

            arbiType = { description: removeImplicit(description, kb0, oldArbiTypes), head, type: 'arbitrary-type' }
        } else if (ast.which) {
            const description = subst(ast.which, [$._.$, head])
            arbiType = { description: removeImplicit(description, kb0, oldArbiTypes), head, type: 'arbitrary-type' }

        } else if (ast.owner) {
            return removeImplicit($.the('thing').which($(ast.owner).has($._.$).as(ast.headType)).$, kb0, oldArbiTypes)
        } else {
            const complement = Object.entries(ast).filter((e): e is [string, LLangAst] => isLLangAst(e[1])).at(0)

            if (complement) {
                return removeImplicit($.the(ast.headType).which($._.has(complement[1]).as(complement[0])).$, kb0, oldArbiTypes)
            } else {
                arbiType = { description: $(true).$, head, type: 'arbitrary-type' }
            }
        }

        // const maybe = searchArbiType(arbiType, kb0, oldArbiTypes)
        // return maybe ?? arbiType
        return arbiType

        // } else if (ast.type === 'when-derivation-clause') {

        //     const conseqAnaphors = findAsts(ast.conseq, 'implicit-reference')
        //     const conseqArbiTypes = conseqAnaphors.map(x => removeImplicit(x, kb0, oldArbiTypes))

        //     const kb = conseqArbiTypes.reduce(
        //         (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
        //         kb0,
        //     )

        //     const whenAnaphors = findAsts(ast.when, 'implicit-reference')
        //     const whenArbiTypes = whenAnaphors.map(x => removeImplicit(x, kb, [...oldArbiTypes, ...conseqArbiTypes]))

        //     const whenReplacements = whenArbiTypes.map(x => {
        //         return searchArbiType(x, kb, conseqArbiTypes) ?? x
        //     })

        //     const newConseq = conseqArbiTypes.reduce(
        //         (f, ab, i) => subst(f, [conseqAnaphors[i], ab]),
        //         ast.conseq,
        //     )

        //     const newWhen = whenReplacements.reduce(
        //         (f, v, i) => subst(f, [whenAnaphors[i], v]),
        //         ast.when,
        //     )

        //     const result: DerivationClause = {
        //         type: 'when-derivation-clause',
        //         conseq: newConseq,
        //         when: newWhen,
        //     }

        //     return result

    } else {
        const anaphors = findAsts(ast, 'implicit-reference')
        const subs = anaphors.map(x => [x, removeImplicit(x, kb0, oldArbiTypes)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, ...subs)
        return result
    }

}

// function searchArbiType(x: ArbitraryType, kb: KnowledgeBase, conseqArbiTypes: ArbitraryType[]) {
//     const v = $('varname:thing').$
//     const query = $(v).suchThat($(x.head).exists.where($(x.description).and($(x.head).has(v).as('var-name')))).$
//     const result = ask(query, kb).result
//     const e2 = conseqArbiTypes.filter(x => x.head.value === result.value).at(0)
//     return e2
// }