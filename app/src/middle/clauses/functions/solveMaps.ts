import { Map } from "../../id/Map";
import { uniq } from "../../../utils/uniq";
import { intersection } from "../../../utils/intersection";
import { SpecialIds } from "../../id/Id";
import { Clause } from "../Clause";

/**
 * Finds possible Map-ings from queryList to universeList
 * {@link "file://./../../../../../docs/notes/unification-algo.md"}
 */
export function solveMaps(queryList: Clause[], universeList: Clause[]): Map[] {

    const candidates = findCandidates(queryList, universeList)

    candidates.forEach((ml1, i) => {
        candidates.forEach((ml2, j) => {

            if (ml1.length && ml2.length && i !== j) {
                const merged = merge(ml1, ml2)
                candidates[i] = []
                candidates[j] = merged
            }

        })
    })

    return candidates.flat().filter(x => !isImposible(x))
}

function findCandidates(queryList: Clause[], universeList: Clause[]): Map[][] {
    return queryList.map(q => {
        const res = universeList.flatMap(u => u.query(q))
        return res.length ? res : [makeImpossible(q)]
    })
}

function merge(ml1: Map[], ml2: Map[]) {

    const merged: Map[] = []

    ml1.forEach(m1 => {
        ml2.forEach(m2 => {

            if (mapsAgree(m1, m2)) {
                merged.push({ ...m1, ...m2 })
            }

        })
    })

    return uniq(merged)
}

function mapsAgree(m1: Map, m2: Map) {
    const commonKeys = intersection(Object.keys(m1), Object.keys(m2))
    return commonKeys.every(k => m1[k] === m2[k])
}

function makeImpossible(q: Clause): Map {
    return q.entities
        .map(x => ({ [x]: SpecialIds.IMPOSSIBLE }))
        .reduce((a, b) => ({ ...a, ...b }), {})
}

function isImposible(map: Map) {
    return Object.values(map).includes(SpecialIds.IMPOSSIBLE)
}