import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { Anaphor, DerivationClause, KnowledgeBase, LLangAst } from "./types.ts";
import { random } from "../utils/random.ts"
import { ArbitraryType } from "./types.ts"
import { ask } from "./ask.ts";


export function removeAnaphors(ast: Anaphor, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): ArbitraryType
export function removeAnaphors<T extends LLangAst>(ast: T, kb0?: KnowledgeBase, oldArbiTypes?: ArbitraryType[]): T
export function removeAnaphors(
    ast: LLangAst,
    kb0 = $.emptyKb,
    oldArbiTypes: ArbitraryType[] = [],
): LLangAst {

    if (ast.type === 'anaphor') {

        const head = $(`x${random()}:${ast.headType}`).$
        let arbiType: ArbitraryType

        if (ast.whose && ast.whose.subject.type === 'entity') {
            const owned = $(`y${random()}:${ast.whose.subject.value}`).$

            const description = $(owned).exists.where($(head).has(owned)
                .and(subst(ast.whose, [ast.whose.subject, owned])))
                .$

            arbiType = { description: removeAnaphors(description, kb0, oldArbiTypes), head, type: 'arbitrary-type' }
        } else if (ast.which) {
            const description = subst(ast.which, [$._.$, head])
            arbiType = { description: removeAnaphors(description, kb0, oldArbiTypes), head, type: 'arbitrary-type' }
        } else {
            arbiType = { description: $(true).$, head, type: 'arbitrary-type' }
        }

        const maybe = searchArbiType(arbiType, kb0, oldArbiTypes)
        return maybe ?? arbiType

    } else if (ast.type !== 'derivation-clause') {
        const anaphors = findAsts(ast, 'anaphor')
        const subs = anaphors.map(x => [x, removeAnaphors(x, kb0, oldArbiTypes)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, ...subs)
        return result
    } else {

        const conseqAnaphors = findAsts(ast.conseq, 'anaphor')
        const conseqArbiTypes = conseqAnaphors.map(x => removeAnaphors(x, kb0, oldArbiTypes))

        const kb = conseqArbiTypes.reduce(
            (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
            kb0,
        )

        const whenAnaphors = findAsts(ast.when, 'anaphor')
        const whenArbiTypes = whenAnaphors.map(x => removeAnaphors(x, kb, [...oldArbiTypes, ...conseqArbiTypes]))

        const whenReplacements = whenArbiTypes.map(x => {
            return searchArbiType(x, kb, conseqArbiTypes) ?? x
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

}

function searchArbiType(x: ArbitraryType, kb: KnowledgeBase, conseqArbiTypes: ArbitraryType[]) {
    const v = $('varname:thing').$
    const query = $(v).suchThat($(x.head).exists.where($(x.description).and($(x.head).has(v).as('var-name')))).$
    const result = ask(query, kb).result
    const e2 = conseqArbiTypes.filter(x => x.head.value === result.value).at(0)
    return e2
}