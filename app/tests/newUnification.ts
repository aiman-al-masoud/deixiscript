import { Id } from "../src/middle/id/Id";
import { Map } from "../src/middle/id/Map";
import { uniq } from "../src/utils/uniq";

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

function listsEqual(l1: any[], l2: any[]) {
    return l1.length === l2.length && l1.every(x => l2.includes(x))
}

function removeLongest(maps: Map[][]) {

    const mapsCopy = maps.slice()

    mapsCopy.forEach((ml1, i) => {
        mapsCopy.forEach((ml2, j) => {
            if (listsEqual(allVars(ml1), allVars(ml2)) && ml1.length !== ml2.length) {
                const longest = ml1.length > ml2.length ? i : j
                mapsCopy[longest] = []
            }
        })
    })

    return mapsCopy

}

function allValsOf(maps: Map[], variable: string) {
    return uniq(maps.flatMap(m => m[variable] ?? []))
}

function allVars(maps: Map[]) {
    return uniq(maps.flatMap(x => Object.keys(x)))
}

function isInvalid(map: Map, allValsOfMem: { [x: Id]: Id[] }) {
    return Object.entries(map).some(x => !allValsOfMem[x[0]].includes(x[1]))
}

function solveMaps(data: Map[][]): Map[] {

    const maps = removeLongest(data).flat()
    // console.log({ maps })
    const oneEntryMaps = maps.filter(m => Object.values(m).length <= 1)
    // console.log({ oneEntryMaps })
    const allVarz = allVars(maps)
    // console.log({ allVarz })
    const allValsOfMem = allVarz.map(x => ({ [x]: allValsOf(oneEntryMaps, x) })).reduce((a, b) => ({ ...a, ...b }), {})
    // console.log({ allValsOfMem })
    const valid = maps.filter(m => !isInvalid(m, allValsOfMem))
    // console.log({ valid })


    valid.forEach((m1, i) => {
        valid.forEach((m2, j) => {

            if (i !== j && Object.entries(m1).some(e => m2[e[0]] === e[1])) {
                valid[j] = { ...m2, ...m1 }
                valid[i] = {}
            }

        })
    })

    const maxLen = Math.max(...valid.map(m => Object.values(m).length))
    return valid.filter(m => Object.values(m).length === maxLen)
}

export function newUnification() {

    const assert1 = JSON.stringify(solveMaps(testData)) === JSON.stringify([{ x: 1, y: 2, z: 3 }, { x: 10, y: 11, z: 12 }])
    const assert2 = JSON.stringify(solveMaps(testData2)) === JSON.stringify([{ x: 1, y: 2, z: 3 }])
    const assert3 = JSON.stringify(solveMaps(testData3)) === JSON.stringify([{ x: 1 }, { x: 2 }, { x: 3 }])
    const assert4 = JSON.stringify(solveMaps(testData4)) === JSON.stringify([{ x: 1 }, { x: 2 }, { x: 3 }, { y: 1 }, { y: 2 }, { y: 3 }])

    console.log(assert1, assert2, assert3, assert4)
}