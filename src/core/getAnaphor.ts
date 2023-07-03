import { findAll } from "./findAll.ts"
import { Anaphor, KnowledgeBase } from "./types.ts"

export function getAnaphor(anaphor: Anaphor, kb: KnowledgeBase) {
    const maps = findAll(anaphor.description, [anaphor.head], kb)
    if (maps.length > 1) {
        console.warn('more than one anaphoric hit!')
    } else if (maps.length <= 0) {
        throw new Error('no anaphora!')
    }

    const candidates = maps.map(x => x.get(anaphor.head))
    candidates.sort((c1, c2) => (kb.deicticDict[c2?.value as string] ?? 0) - (kb.deicticDict[c1?.value as string] ?? 0))
    // console.log(candidates)

    if (kb.deicticDict[candidates[0]?.value as string] === kb.deicticDict[candidates[1]?.value as string]) console.warn('no real deictic difference between first and second cadidate')

    const result = candidates[0]

    return result
}
