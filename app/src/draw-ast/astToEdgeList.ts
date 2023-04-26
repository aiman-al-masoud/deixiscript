import { AstNode } from "../frontend/parser/interfaces/AstNode";

export function astToEdgeList(
    ast: AstNode,
    parentName?: string,
    edges: EdgeList = [],
): EdgeList {

    const links = Object.entries(ast).filter(e => e[1] && e[1].type)

    const astName = (ast.role ?? ast.lexeme?.root ?? ast.type) + random()

    const additions: EdgeList = []

    if (parentName) {
        additions.push([parentName, astName])
    }

    if (!links.length && !ast.list) { // leaf!
        return [...edges, ...additions]
    }

    if (links.length) {
        return links
            .flatMap(e => {
                const ezero = e[0] + random()
                return [...additions, [astName, ezero], ...astToEdgeList(e[1], ezero, edges)]
            })
    }

    if (ast.list) {
        const list = ast.list.flatMap(x => astToEdgeList(x, astName, edges))
        return [...additions, ...edges, ...list]
    }

    return []
}

function random() {
    return parseInt(100000 * Math.random() + '')
}