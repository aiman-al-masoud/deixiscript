/**
 * get root node ie: node such that it has no parents.
 * get all of its children.
 * plot them.
 * remove affected tuples.
 * repeat until there are no more tuples.
 */
export function getPos(initialPos: Coordinate, data: EdgeList, dict: { [x: string]: Coordinate } = {}): { [x: string]: Coordinate } {

    const root = getRoot(data)
    const children = getChildrenOf(root, data)
    const rootPos = dict[root] ?? initialPos

    const yStep = 30
    const xStep = 30

    const xDisplacements = children.map((_, i) => i * xStep * (i < children.length / 2 ? -1 : 1)) //+ 30*Math.random()

    const childMap = children
        .map((c, i) => ({ [c]: { x: rootPos.x + xDisplacements[i], y: rootPos.y + yStep } }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    const remainingData = data.filter(x => !x.includes(root))
    const partialResult = { ...dict, ...childMap, ...(root ? { [root]: rootPos } : {}) }

    if (remainingData.length && root !== undefined) {
        return getPos(initialPos, remainingData, partialResult)
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


