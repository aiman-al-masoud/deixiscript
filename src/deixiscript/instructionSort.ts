import { WorldModel } from "../machines-like-us/types.ts";
import { uniq } from "../utils/uniq.ts";

export function instructionSort(wm: WorldModel): (readonly [string, string])[] {

    const data = wm.filter(x => x[2] === 'use' || x[2] === 'def')
    const instructions = uniq(data.map(x => x[0]))

    const results = instructions.flatMap(i => {
        const relevant = data.filter(x => x[0] === i)
        const uses = relevant.filter(x => x[2] === 'use')
        const usedVars = uses.map(x => x[1])
        const reallyRelevant = data.filter(x => usedVars.includes(x[1]) && x[2] === 'def')
        const dependencies = reallyRelevant.map(x => x[0])
        const res = dependencies.map(d => [d, i] as const)
        return res
    })

    const k = kahn(results)
    console.log(k)

    return results
}


function kahn(edgeList: (readonly [string, string])[]) {

    console.log(edgeList)

    const l: string[] = []
    const dependents = uniq(edgeList.map(x => x[1]))
    const all = uniq(edgeList.flatMap(x => [...x]))
    const s = all.filter(x => !dependents.includes(x))

    while (s.length) {
        const n = s.pop()!
        l.push(n)

        edgeList.filter(x => x[0] === n).forEach(edge => {
            const m = edge[1]
            const mHasOtherIncoming = edgeList.some(otherEdge => otherEdge[1] === m && otherEdge[0] !== n)

            edgeList = edgeList.filter(e => e !== edge)

            if (!mHasOtherIncoming) {
                l.push(m)
            }
        })

    }

    console.log(edgeList)
    console.log(l)
}


// L ← Empty list that will contain the sorted elements
// S ← Set of all nodes with no incoming edge

// while S is not empty do
//     remove a node n from S
//     add n to L
//     for each node m with an edge e from n to m do
//         remove edge e from the graph
//         if m has no other incoming edges then
//             insert m into S

// if graph has edges then
//     return error   (graph has at least one cycle)
// else 
//     return L   (a topologically sorted order)
