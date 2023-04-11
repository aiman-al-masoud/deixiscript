
/* 
get root node ie: node such that it has no parents.
get all of its children.
plot them.
remove affected tuples.
repeat until there are no more tuples.
*/

export function getPos(data: EdgeList, dict: { [x: string]: { x: number, y: number } } = {}): { [x: string]: { x: number, y: number } } {

    const root = getRoot(data)
    // console.log(root)
    const children = getChildrenOf(root, data)

    const rootPos = dict[root] ?? { x: 500, y: 50 }
    const yDisplacement = 100
    const xDisplacementBit = 100

    const xDisplacements = children.map((_, i) => i * xDisplacementBit * (i < children.length / 2 ? -1 : 1))

    const childMap = children
        .map((c, i) => ({ [c]: { x: rootPos.x + xDisplacements[i], y: rootPos.y + yDisplacement } }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    const remainingData = data.filter(x => !x.includes(root))
    const partialResult = { ...dict, ...childMap, ...(root ? { [root]: rootPos } : {}) }

    if (remainingData.length && root !== undefined) {
        return getPos(remainingData, partialResult)
    }

    return partialResult
}


function getRoot(edges: EdgeList) {
    const nodes = edges.flat()
    return nodes.filter(x => !edges.some(t => t[1] === x))[0]
}

function getChildrenOf(parent: string, edges: EdgeList) {
    return edges.filter(x => x[0] === parent).map(x => x[1])
}
