import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { findAst } from "./findAst.ts";
import { expand } from "./getAnaphora.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { DerivationClause, isAnaphor } from "./types.ts";

export function removeAnaphors(ast: DerivationClause) {

    const conseqAnaphors = Object.values(ast.conseq).filter(isAnaphor) // maybe use findAst()
    const conseqArbiTypes = conseqAnaphors.map(expand)

    const kb = conseqArbiTypes.reduce(
        (a, b) => tell($(b.head).suchThat($(b.description).and($(b.head).has(b.head.value).as('var-name')).$).exists.$, a).kb,
        $.emptyKb,
    )

    const whenAnaphors = findAst(ast.when, 'anaphor', 2)
    const whenArbiTypes = whenAnaphors.map(expand)

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

// a cat does eat a mouse when the cat has the mouse as food.
// x:cat does eat y:mouse when x:cat has y:mouse as food.

// a cat whose fur has red as color does eat a mouse when the cat has the mouse as food.

// const x = $({ subject: $.a('cat').whose($('fur').has('red').as('color')).$, verb: 'eat', object: $.a('mouse').$ })
//     .when($.the('cat').has($.the('mouse')).as('food').and($.the('dog').has('stupid').as('intelligence'))).$


// const x = $({ subject: $.the('cat').$, verb: 'be', object: 'red' }).when(
//     $.the('cat').has('red').as('color')
// ).$

// const x = $({ subject: $.the('cat').whose($('fur').has('red').as('color')).$, verb: 'be', object: 'red' }).when(
//     $.the('cat').has('red').as('color')
// ).$

// // console.log(x)
// // console.log('----------------')
// const result = removeAnaphorsFrom(x)
// console.log(result)



