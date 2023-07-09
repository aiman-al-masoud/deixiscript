import { isNotNullish } from "../utils/isNotNullish.ts"
import { findAll } from "./findAll.ts"
import { Anaphor, Constant, KnowledgeBase } from "./types.ts"

export function getAnaphora(anaphor: Anaphor, kb: KnowledgeBase): Constant[] {

    const maps = findAll(anaphor.description, [anaphor.head], kb)

    if (maps.length > 1 && anaphor.number === 1) {
        console.warn('more than one anaphoric hit!')
    } else if (maps.length <= 0) {
        // console.warn('no anaphora!')
        throw new Error('no anaphora!')
    }

    const candidates = maps.map(x => x.get(anaphor.head)).filter(isNotNullish)

    candidates.sort(
        (c1, c2) => (kb.deicticDict[c2?.value as string] ?? 0) - (kb.deicticDict[c1?.value as string] ?? 0)
    )

    if (
        kb.deicticDict[candidates[0]?.value as string]
        === kb.deicticDict[candidates[1]?.value as string]
    ) {
        console.warn('no real deictic difference between first and second cadidate')
    }

    if (anaphor.number === 1) {
        return [candidates[0]]
    } else {
        return candidates
    }

}
