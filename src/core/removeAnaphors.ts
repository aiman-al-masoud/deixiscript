import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { Anaphor, Constant, DerivationClause, KnowledgeBase, LLangAst, isAnaphor } from "./types.ts";
import { isNotNullish } from "../utils/isNotNullish.ts"
import { random } from "../utils/random.ts"
import { ArbitraryType } from "./types.ts"

export function removeAnaphors<T extends LLangAst>(ast: T, kb0: KnowledgeBase): T
export function removeAnaphors(ast: LLangAst, kb0: KnowledgeBase): LLangAst {

    if (ast.type !== 'derived-prop') {
        const anaphors = findAsts(ast, 'anaphor', 2)
        const swaps = anaphors.map(x => [x, getAnaphora(x, kb0)[0]] as [Anaphor, Constant])
        if (swaps.length === 0) return ast
        const result = subst(ast, ...swaps)
        return result
    }

    const conseqAnaphors = Object.values(ast.conseq).filter(isAnaphor) // maybe use findAst()
    const conseqArbiTypes = conseqAnaphors.map(anaphorToArbitraryType)

    const kb = conseqArbiTypes.reduce(
        (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
        kb0,
    )

    const whenAnaphors = findAsts(ast.when, 'anaphor', 2)
    const whenArbiTypes = whenAnaphors.map(anaphorToArbitraryType)

    const whenReplacements = whenArbiTypes.map((x, i) => {
        const v = $('varname:thing').$
        const query = $(x.description).and($(x.head).has(v).as('var-name')).$
        const results = findAll(query, [v, x.head], kb)
        const e = results.at(0)?.get(v)
        return e ? $(`${e?.value}:${x.head.varType}`).$ : whenAnaphors[i] // static scoping would be a better idea (at the moment of derivation clause definition)
    })

    const newConseq = conseqArbiTypes.reduce(
        (a, b, i) => subst(a, [conseqAnaphors[i], b.head]),
        ast.conseq,
    )

    const newWhen = whenReplacements.reduce(
        (a, b, i) => subst(a, [whenAnaphors[i], $(b).$]),
        ast.when
    )

    const conseqRestrictions = conseqArbiTypes.map(x => x.description)
    const whenRestrictions = whenArbiTypes.map(x => x.description)
    const restrictions = conseqRestrictions.concat(whenRestrictions)
    const preconditions = restrictions.length ?
        restrictions.reduce((a, b) => $(a).and(b).$)
        : $(true).$

    const result: DerivationClause = {
        type: 'derived-prop',
        conseq: newConseq,
        when: newWhen,
        preconditions,
    }

    return result

}

function getAnaphora(anaphor: Anaphor, kb: KnowledgeBase): Constant[] {

    const { description, head } = anaphorToArbitraryType(anaphor)

    const maps = findAll(description, [head], kb)

    if (maps.length > 1 && anaphor.number === 1) {
        console.warn('more than one anaphoric hit!')
    } else if (maps.length <= 0) {
        // console.warn('no anaphora!')
        throw new Error('no anaphora!')
    }

    const candidates = maps.map(x => x.get(head)).filter(isNotNullish)

    candidates.sort(
        (c1, c2) => (kb.deicticDict[c2?.value as string] ?? 0) - (kb.deicticDict[c1?.value as string] ?? 0)
    )

    if (
        kb.deicticDict[candidates[0]?.value as number ?? 0]
        === kb.deicticDict[candidates[1]?.value as number ?? 0]
    ) {
        console.warn('no real deictic difference between first and second cadidate')
    }

    if (anaphor.number === 1) {
        return [candidates[0]]
    } else {
        return candidates
    }

}

export function anaphorToArbitraryType(anaphor: Anaphor): ArbitraryType {
    const head = $(`x${random()}:${anaphor.headType}`).$

    if (anaphor.whose && anaphor.whose.t1.type === 'entity') {
        const owned = $(`y${random()}:${anaphor.whose.t1.value}`).$

        const description = $(owned).exists.where($(head).has(owned)
            .and(subst(anaphor.whose, [anaphor.whose.t1, owned])))
            .$

        return { description, head, type: 'arbitrary-type' }
    }

    if (anaphor.which) {
        const description = subst(anaphor.which, [$._.$, head])
        return { description, head, type: 'arbitrary-type' }
    }

    return { description: $(true).$, head, type: 'arbitrary-type' }
}
