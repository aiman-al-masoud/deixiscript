
export function getCoords(
    initialPos: Coordinate,
    data: EdgeList,
    oldCoords: { [x: string]: Coordinate } = {},
): { [x: string]: Coordinate } {

    const root = getRoot(data) // node w/out parents

    if (!root) {
        return oldCoords
    }

    const children = getChildrenOf(root, data)
    const rootPos = oldCoords[root] ?? initialPos

    const yOffset = 30
    const xOffset = 30

    const childCoords = children
        .map((c, i) => ({ [c]: { x: rootPos.x + i * xOffset * (i < children.length / 2 ? -1 : 1), y: rootPos.y + yOffset } }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    const remainingData = data.filter(x => !x.includes(root))
    const partialResult = { ...oldCoords, ...childCoords, ...{ [root]: rootPos } }

    return getCoords(initialPos, remainingData, partialResult)
}

function getRoot(edges: EdgeList): string | undefined {
    return edges
        .flat() // the nodes
        .filter(n => !edges.some(e => e[1] === n))[0]
}

function getChildrenOf(parent: string, edges: EdgeList) {
    return edges.filter(x => x[0] === parent).map(x => x[1])
}
