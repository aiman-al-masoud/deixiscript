import { findAll } from "./findAll.ts"
import { Anaphor, Atom, KnowledgeBase } from "./types.ts"

// export function resolveAnaphor<T extends Atom>(atom: T, kb: KnowledgeBase) {
//     return atom.type === 'anaphor' ? getAnaphor(atom, kb)! : atom
// }

export function getAnaphor(anaphor: Anaphor, kb: KnowledgeBase) {
    const maps = findAll(anaphor.description, [anaphor.head], kb)
    if (maps.length > 1) {
        console.warn('more than one anaphoric hit!')
    } else if (maps.length <= 0) {
        throw new Error('no anaphora!')
    }

    const candidates = maps.map(x => x.get(anaphor.head))
    // console.log(candidates)
    candidates.sort((c1, c2) => kb.deicticDict[c2?.value as string] - kb.deicticDict[c1?.value as string])
    // console.log(candidates)
    const result = candidates[0]

    return result
}
