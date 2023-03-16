import { Id } from "../src/middle/id/Id";
import { Map } from "../src/middle/id/Map";
import { uniq } from "../src/utils/uniq";

const testData: Map[] = [
    { x: 1 }, { x: 10 },
    { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 },
    { y: 2 }, { y: 11 },
    { y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 },
    { z: 3 }, { z: 12 },
    { x: 1 }, { x: 10 },
]

const testData2: Map[] = [// WRONG RESULT FOR THIS TEST!
    { x: 1 }, { x: 10 },
    { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 },
    { y: 2 }, { y: 11 },
    { y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 },
    { z: 3 }, { z: 12 },
    { x: 1 }
]


function allValsOf(maps: Map[], variable: string) {
    return uniq(maps.flatMap(m => m[variable] ?? []))
}

function allVars(maps: Map[]) {
    return uniq(maps.flatMap(x => Object.keys(x)))
}

function isInvalid(map: Map, allValsOfMem: { [x: Id]: Id[] }) {
    return Object.entries(map).some(x => !allValsOfMem[x[0]].includes(x[1]))
}

function solveMaps(maps: Map[]): Map[] {

    const oneEntryMaps = maps.filter(m => Object.values(m).length <= 1)
    const allValsOfMem = allVars(oneEntryMaps).map(x => ({ [x]: allValsOf(oneEntryMaps, x) })).reduce((a, b) => ({ ...a, ...b }))
    const valid = maps.filter(m => !isInvalid(m, allValsOfMem))

    valid.forEach((m1, i) => {
        valid.forEach((m2, j) => {

            if (i !== j && Object.entries(m1).some(e => m2[e[0]] === e[1])) {
                valid[j] = { ...m2, ...m1 }
                valid[i] = {}
            }

        })
    })

    return valid.filter(m => Object.values(m).length)
}


export function newUnification() {
    const maps = solveMaps(testData)
    console.log(maps)
}