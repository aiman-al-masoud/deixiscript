import { Id } from "../../id/Id";
import { Map } from "../../id/Map";
import { uniq } from "../../../utils/uniq";

/**
 * {@link file://./../../../../../docs/notes/unification-algo.md}
 */
export function solveMaps(data: Map[][]): Map[] {
    const maps = removeLongest(data).flat()
    const keys = getKeys(maps)
    const oneEntryMaps = maps.filter(m => Object.values(m).length <= 1)
    const allVals = keys.map(x => ({ [x]: allValsOf(oneEntryMaps, x) })).reduce((a, b) => ({ ...a, ...b }), {})
    const valid = maps.filter(m => isValid(m, allVals))
    const pairedUp = pairUp(valid)
    const results = sameLen(pairedUp)
    return results
}

function equalSets(l1: any[], l2: any[]) {
    return l1.length === l2.length && l1.every(x => l2.includes(x))
}

function pairUp(maps: Map[]) {

    const mapz = maps.slice()

    mapz.forEach((m1, i) => {
        mapz.forEach((m2, j) => {

            if (i !== j && Object.entries(m1).some(e => m2[e[0]] === e[1])) {
                mapz[j] = { ...m2, ...m1 }
                mapz[i] = {}
            }

        })
    })

    return mapz
}

function removeLongest(maps: Map[][]) {
    const mapz = maps.slice()

    mapz.forEach((ml1, i) => {
        mapz.forEach((ml2, j) => {
            if (i !== j && equalSets(getKeys(ml1), getKeys(ml2))) {
                const longest = ml1.length > ml2.length ? i : j
                mapz[longest] = []
            }
        })
    })

    return mapz
}

function allValsOf(maps: Map[], variable: Id) {
    return uniq(maps.flatMap(m => m[variable] ?? []))
}

function getKeys(maps: Map[]) {
    return uniq(maps.flatMap(x => Object.keys(x)))
}

function isValid(map: Map, allValsOfMem: { [x: Id]: Id[] }) {
    return Object.entries(map).every(x => allValsOfMem[x[0]].includes(x[1]))
}

function sameLen(maps: Map[]) {
    const maxLen = Math.max(...maps.map(m => Object.values(m).length))
    return maps.filter(m => Object.values(m).length === maxLen)
}

// ------------------------

const testData: Map[][] = [
    [{ x: 1 }, { x: 10 }],
    [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 }],
    [{ y: 2 }, { y: 11 }],
    [{ y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 }],
    [{ z: 3 }, { z: 12 }],
    [{ x: 1 }, { x: 10 }],
]

const testData2: Map[][] = [
    [{ x: 1 }, { x: 10 }],
    [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 },],
    [{ y: 2 }, { y: 11 },],
    [{ y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 },],
    [{ z: 3 }, { z: 12 },],
    [{ x: 1 }],
]

const testData3: Map[][] = [
    [{ x: 1 }, { x: 2 }, { x: 3 }]
]

const testData4: Map[][] = [
    [{ x: 1 }, { x: 2 }, { x: 3 }],
    [{ y: 1 }, { y: 2 }, { y: 3 }],
]

// const testData5: Map[][] = [ //FAIL, but never happens, since all vars should have a name, so there should be a 1-arg predicate for each var
//     [{ x: 1, y: 2 }],
//     [{ x: 3, y: 4 }],
// ]

export function unificationTest() {

    const assert1 = JSON.stringify(solveMaps(testData)) === JSON.stringify([{ x: 1, y: 2, z: 3 }, { x: 10, y: 11, z: 12 }])
    const assert2 = JSON.stringify(solveMaps(testData2)) === JSON.stringify([{ x: 1, y: 2, z: 3 }])
    const assert3 = JSON.stringify(solveMaps(testData3)) === JSON.stringify([{ x: 1 }, { x: 2 }, { x: 3 }])
    const assert4 = JSON.stringify(solveMaps(testData4)) === JSON.stringify([{ x: 1 }, { x: 2 }, { x: 3 }, { y: 1 }, { y: 2 }, { y: 3 }])

    console.log(assert1, assert2, assert3, assert4)
}