import { Map } from "../../id/Map";
import { uniq } from "../../../utils/uniq";

/**
 * {@link "file://./../../../../../docs/notes/unification-algo.md"}
 */
export function solveMaps(data: Map[][]): Map[] {

    const dataCopy = data.slice()

    dataCopy.forEach((ml1, i) => {
        dataCopy.forEach((ml2, j) => {

            if (ml1.length && ml2.length && i !== j) {
                const merged = merge(ml1, ml2)
                dataCopy[i] = []
                dataCopy[j] = merged
            }

        })
    })

    return dataCopy.flat()
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

function intersection(xs: string[], ys: string[]) {
    return uniq(xs.filter(x => ys.includes(x))
        .concat(ys.filter(y => xs.includes(y))))
}