import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { findAsts } from "./findAsts.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { Anaphor, DerivationClause, LLangAst, isAnaphor } from "./types.ts";
import { random } from "../utils/random.ts"
import { ArbitraryType } from "./types.ts"


export function removeAnaphors(ast: Anaphor): ArbitraryType
export function removeAnaphors<T extends LLangAst>(ast: T): T
export function removeAnaphors<T extends LLangAst>(ast: T): T
export function removeAnaphors(ast: LLangAst): LLangAst {

    if (ast.type !== 'derived-prop') {
        const anaphors = findAsts(ast, 'anaphor') as Anaphor[]
        const subs = anaphors.map(x => [x, anaphorToArbitraryType(x)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast
        const result = subst(ast, ...subs)
        return result
    }

    const conseqAnaphors = Object.values(ast.conseq).filter(isAnaphor) // maybe use findAst()
    const conseqArbiTypes = conseqAnaphors.map(anaphorToArbitraryType)

    const kb = conseqArbiTypes.reduce(
        (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
        $.emptyKb,
    )

    const whenAnaphors = findAsts(ast.when, 'anaphor', 2)
    const whenArbiTypes = whenAnaphors.map(anaphorToArbitraryType)

    const whenReplacements = whenArbiTypes.map((x, i) => {
        const v = $('varname:thing').$
        const query = $(x.description).and($(x.head).has(v).as('var-name')).$ // use match and conseqArbiTypes instead?
        const results = findAll(query, [v, x.head], kb)
        const e = results.at(0)?.get(v)
        const e2 = conseqArbiTypes.filter(x => x.head.value === e?.value).at(0)
        return e2 ?? whenArbiTypes[i]
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
        type: 'derived-prop',
        conseq: newConseq,
        when: newWhen,
    }

    return result

}

function anaphorToArbitraryType(anaphor: Anaphor): ArbitraryType {
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