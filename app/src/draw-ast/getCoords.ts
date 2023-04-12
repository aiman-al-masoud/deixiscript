/**
 * 1. get current root node ie: node such that it has no parents.
 * 1. get all of its children.
 * 1. plot them.
 * 1. remove tuples that contain current root.
 * 1. repeat until there are no more tuples or root is undefined.
 */
export function getCoords(initialPos: Coordinate, data: EdgeList, dict: { [x: string]: Coordinate } = {}): { [x: string]: Coordinate } {

    const root = getRoot(data)
    const children = getChildrenOf(root, data)
    const rootPos = dict[root] ?? initialPos

    const yOffset = 30
    const xOffset = 30

    const xDisplacements = children
        .map((_, i) => i * xOffset * (i < children.length / 2 ? -1 : 1)) //+ 30*Math.random()

    const childMap = children
        .map((c, i) => ({ [c]: { x: rootPos.x + xDisplacements[i], y: rootPos.y + yOffset } }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    const remainingData = data.filter(x => !x.includes(root))
    const partialResult = { ...dict, ...childMap, ...(root ? { [root]: rootPos } : {}) }

    if (remainingData.length && root !== undefined) {
        return getCoords(initialPos, remainingData, partialResult)
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
