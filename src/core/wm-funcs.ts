import { isNotNullish } from "../utils/isNotNullish.ts";
import { uniq } from "../utils/uniq.ts";
import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { WorldModel, WmAtom, isIsASentence, wmSentencesEqual } from "./types.ts";


export function getParts(concept: WmAtom, cm: WorldModel): WmAtom[] {

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

    const supers = findAll($(concept).isa('x:thing').$, [$('x:thing').$], { wm: cm, derivClauses: [], deicticDict: {} }).map(x => x.get($('x:thing').$)).filter(isNotNullish).map(x => x.value)

    const parts = cm
        .filter(x => x[0] === concept && x.length === 3 && x[2] === 'part')
        .map(x => x[1])

    const all = supers.filter(x => x !== concept).flatMap(x => getAllParts(x, cm)).concat(parts)
    return uniq(all)
}

function subjectOf(concept: WmAtom, cm: WorldModel): WmAtom | undefined {
    return cm.filter(x =>
        x.length === 3
        && x[2] === 'subject'
        && x[0] === concept).map(x => x[1]).at(0)
}

export function getConceptsOf(x: WmAtom, cm: WorldModel): WmAtom[] {

    const r = cm.filter(s => s[0] === x && isIsASentence(s))
        .map(s => s[1])
        .flatMap(c => [c, ...getConceptsOf(c, cm)])
        .concat(['thing'])

    return uniq(r)
}

export function subtractWorldModels(wm1: WorldModel, wm2: WorldModel): WorldModel {
    return wm1.filter(s1 => !wm2.some(s2 => wmSentencesEqual(s1, s2)))
}

export function addWorldModels(...wms: WorldModel[]): WorldModel {
    return uniq(wms.reduce((wm1, wm2) => wm1.concat(wm2), []))
}