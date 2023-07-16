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

    if (ast.type !== 'derivation-clause') {
        const anaphors = findAsts(ast, 'anaphor') as Anaphor[]
        const subs = anaphors.map(x => [x, anaphorToArbitraryType(x)] as [LLangAst, LLangAst])
        if (subs.length === 0) return ast

        // console.log(findAsts(ast, 'anaphor').length)
        const result = subst(ast, ...subs)
        // console.log(findAsts(result, 'anaphor').length)

        return result
    }

    const conseqAnaphors = Object.values(ast.conseq).filter(isAnaphor) // maybe use findAst()
    const conseqArbiTypes = conseqAnaphors.map(x => anaphorToArbitraryType(x))

    const kb = conseqArbiTypes.reduce(
        (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
        $.emptyKb,
    )

    const whenAnaphors = findAsts(ast.when, 'anaphor')
    const whenArbiTypes = whenAnaphors.map(x => anaphorToArbitraryType(x))

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
        type: 'derivation-clause',
        conseq: newConseq,
        when: newWhen,
    }

    return result

}



function anaphorToArbitraryType(ast: Anaphor): ArbitraryType
function anaphorToArbitraryType<T extends LLangAst>(ast: T): T
function anaphorToArbitraryType<T extends LLangAst>(ast: T): T
function anaphorToArbitraryType(ast: LLangAst): LLangAst {

    if (ast.type !== 'anaphor') {
        const anaphors = findAsts(ast, 'anaphor')
        const anaphorsToArbi = anaphors.map(x => [x, anaphorToArbitraryType(x)] as [LLangAst, LLangAst])
        if (anaphorsToArbi.length === 0) return ast
        const result = subst(ast, ...anaphorsToArbi)
        return result
    }

    const head = $(`x${random()}:${ast.headType}`).$

    if (ast.whose && ast.whose.t1.type === 'entity') {
        const owned = $(`y${random()}:${ast.whose.t1.value}`).$

        const description = $(owned).exists.where($(head).has(owned)
            .and(subst(ast.whose, [ast.whose.t1, owned])))
            .$

        return { description, head, type: 'arbitrary-type' }
    }

    if (ast.which) {
        const description = subst(ast.which, [$._.$, head])
        // if (description.t1.type === 'anaphor') description.t1 = $('x:panel').$
        // console.log(description)
        return { description: anaphorToArbitraryType(description), head, type: 'arbitrary-type' }
    }

    // console.log('head=', head)
    return { description: $(true).$, head, type: 'arbitrary-type' }
}