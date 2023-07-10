import { deepMapOf } from "../utils/DeepMap.ts"
import { isNotNullish } from "../utils/isNotNullish.ts"
import { random } from "../utils/random.ts"
import { $ } from "./exp-builder.ts"
import { findAll } from "./findAll.ts"
import { subst, substAll } from "./subst.ts"
import { Anaphor, Constant, KnowledgeBase, LLangAst, Variable } from "./types.ts"

export function getAnaphora(anaphor: Anaphor, kb: KnowledgeBase): Constant[] {


    const { description, head } = expand(anaphor)

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


function expand(anaphor: Anaphor): {
    description: LLangAst,
    head: Variable,
} {
    const head = $(`x${random()}:${anaphor.headType}`).$

    if (anaphor.whose && anaphor.whose.t1.type === 'entity') {
        const owned = $(`y${random()}:${anaphor.whose.t1.value}`).$
        const description = $(owned).exists.where($(head).has(owned).and({ ...anaphor.whose, t1: owned })).$
        return { description, head }
    }

    if (anaphor.which) {
        const description = { ...anaphor.which, t1: head }
        return { description, head }
    }

    return { description: $(true).$, head }
}


// const x = $.the('house').$
// console.log($.the('house').whose($('window').has($.a('handle').whose($('color').equals('red')))))
// const x = $.the('house').whose($('window').has('open').as('state')).$
// console.log(x)
// const xex = expand(x)
// console.log(xex)

// const x = $.the('cat').which($._.has('red').as('color')).$
// const xex = expand(x)
// console.log(xex)


