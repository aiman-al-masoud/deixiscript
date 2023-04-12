import { uniq } from "../utils/uniq"

export function getCoords(
    initialPos: Coordinate,
    data: EdgeList,
    oldCoords: { [x: string]: Coordinate } = {},
    nestingFactor = 1,
): { [x: string]: Coordinate } {

    const root = getRoot(data) // node w/out a parent

    if (!root) {
        return oldCoords
    }

    const children = getChildrenOf(root, data)
    const rootPos = oldCoords[root] ?? initialPos

    const yOffset = 50
    const xOffset = 200

    const childCoords = children
        .map((c, i) => ({ [c]: { x: rootPos.x + i * nestingFactor * xOffset * (i % 2 == 0 ? 1 : -1), y: rootPos.y + yOffset * (nestingFactor + 1) } }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    const remainingData = data.filter(x => !x.includes(root))
    const partialResult = { ...oldCoords, ...childCoords, ...{ [root]: rootPos } }

    return getCoords(initialPos, remainingData, partialResult, 0.9 * nestingFactor)
}

function getRoot(edges: EdgeList): string | undefined {
    return edges
        .flat() // the nodes
        .filter(n => !edges.some(e => e[1] === n))[0]
}

function getChildrenOf(parent: string, edges: EdgeList) {
    return uniq(edges.filter(x => x[0] === parent).map(x => x[1])) //TODO duplicate children aren't plotted twice, but still make the graph uglier because they add "i" indeces in childCoords computation and make single child display NOT straight down.
}
