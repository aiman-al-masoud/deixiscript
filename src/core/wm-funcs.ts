import { uniq } from "../utils/uniq.ts";
import { WorldModel, WmAtom, isIsASentence } from "./types.ts";


export function getParts(concept: string, cm: WorldModel): WmAtom[] {

    const parts = getAllParts(concept, cm)
    const cancelAnnotations = parts.filter(x => getConceptsOf(x, cm).includes('cancel-annotation'))

    const allCancelled = cancelAnnotations
        .map(x => subjectOf(x, cm))

    const nonCancelledCancelAnnotations =
        cancelAnnotations.filter(x => !allCancelled.includes(x))

    const allCancelledForReal =
        nonCancelledCancelAnnotations.map(x => subjectOf(x, cm))
            .filter(x => x)

    const all = parts
        .filter(x => !allCancelledForReal.includes(x))
        .filter(x => !cancelAnnotations.includes(x))

    const results = uniq(all)
    return results
}

function getAllParts(concept: WmAtom, cm: WorldModel): WmAtom[] {

    const supers = getSupers(concept, cm)

    const parts = cm
        .filter(x => x[0] === concept && x.length === 3 && x[2] === 'part')
        .map(x => x[1])

    return supers.flatMap(x => getAllParts(x, cm)).concat(parts)

}


function subjectOf(concept: WmAtom, cm: WorldModel): WmAtom | undefined {
    return cm.filter(x =>
        x.length === 3
        && x[2] === 'subject'
        && x[0] === concept).map(x => x[1]).at(0)
}

export function getSupers(concept: WmAtom, cm: WorldModel): WmAtom[] {

    const supers = cm
        .filter(x => x[0] === concept && x[2] === 'superconcept')
        .map(x => x[1])

    if (!supers.length) {
        return []
    }

    return [...supers, ...supers.flatMap(x => getSupers(x, cm)), 'thing']

}

export function getConceptsOf(x: WmAtom, cm: WorldModel): WmAtom[] {
    return cm.filter(s => s[0] === x && isIsASentence(s))
        .map(s => s[1])
        .flatMap(c => [c, ...getSupers(c, cm)])
        .concat(['thing'])
}

export function getSupersAndConceptsOf(x: WmAtom, cm: WorldModel) {
    return uniq(getSupers(x, cm).concat(getConceptsOf(x, cm)))
}