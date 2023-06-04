import { WorldModel, WmAtom, isIsASentence } from "./types.ts";


export function getParts(concept: string, cm: WorldModel): WmAtom[] {

    const parts = getAllParts(concept, cm)
    const cancelAnnotations = parts.filter(x => getSupers(x, cm).includes('cancel-annotation'))

    const allCancelled = cancelAnnotations
        .map(x => subjectOf(x, cm))

    const nonCancelledCancelAnnotations =
        cancelAnnotations.filter(x => !allCancelled.includes(x))

    const allCancelledForReal =
        nonCancelledCancelAnnotations.map(x => subjectOf(x, cm))
            .filter(x => x)

    return parts
        .filter(x => !allCancelledForReal.includes(x))
        .filter(x => !cancelAnnotations.includes(x))

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

    return [...supers, ...supers.flatMap(x => getSupers(x, cm))]

}

export function getConceptsOf(x: WmAtom, cm: WorldModel) {
    return cm.filter(s => s[0] === x && isIsASentence(s))
        .map(s => s[1])
        .flatMap(c => [c, ...getSupers(c, cm)])
}

// const x = getSupers('multiple-birth-event', model)
// const y = getAllParts('multiple-birth-event', model)
// const z = getParts('multiple-birth-event', model)
// console.log(x)
// console.log(y)
// console.log(z)
// console.log(findInstances('person', model))


