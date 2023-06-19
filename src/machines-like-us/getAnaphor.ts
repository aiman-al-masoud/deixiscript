import { findAll } from "./findAll.ts"
import { Anaphor, KnowledgeBase } from "./types.ts"

export function getAnaphor(anaphor: Anaphor, kb: KnowledgeBase) {
    const maps = findAll(anaphor.description, [anaphor.head], kb)
    if (maps.length > 1) {
        console.warn('more than one anaphoric hit!')
    } else if (maps.length <= 0) {
        throw new Error('no anaphora!')
    }

    return maps.at(-1)!.get(anaphor.head)
}

