import { uniq } from "../utils/uniq.ts";
import { WorldModel, WmAtom, KnowledgeBase, conceptsOf } from "./types.ts";


export function getParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

    const parts = getAllParts(concept, kb)

    const cancelAnnotations = parts.filter(x => {
        return conceptsOf(x, kb).includes('cancel-annotation')
    })

    const allCancelled = cancelAnnotations
        .map(x => subjectOf(x, kb.wm))

    const nonCancelledCancelAnnotations =
        cancelAnnotations.filter(x => !allCancelled.includes(x))

    const allCancelledForReal =
        nonCancelledCancelAnnotations.map(x => subjectOf(x, kb.wm))
            .filter(x => x)

    const all = parts
        .filter(x => !allCancelledForReal.includes(x))
        .filter(x => !cancelAnnotations.includes(x))

    const results = uniq(all)
    return results
}

function getAllParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

    const supers = conceptsOf(concept, kb)

    const parts = kb.wm
        .filter(x => x[0] === concept && x.length === 3 && x[2] === 'part')
        .map(x => x[1])

    const all = supers.filter(x => x !== concept).flatMap(x => getAllParts(x, kb)).concat(parts)
    return uniq(all)
}

function subjectOf(concept: WmAtom, cm: WorldModel): WmAtom | undefined {
    return cm.filter(x =>
        x.length === 3
        && x[2] === 'subject'
        && x[0] === concept).map(x => x[1]).at(0)
}

