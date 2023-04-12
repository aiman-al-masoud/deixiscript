import { AstNode } from "../frontend/parser/interfaces/AstNode";

export function astToEdgeList(
    ast: AstNode,
    parentName?: string,
    edges: EdgeList = [],
): EdgeList {

    const astName = ((ast.role ?? ast.lexeme?.root ?? ast.type).replaceAll('-', '_').replaceAll(':', '_aka_').replaceAll('"', "quote")) + random()

    const additions: EdgeList = []

    if (parentName) {
        additions.push([parentName, astName])
    }

    if (!ast.links && !ast.list) { // leaf!
        return [...edges, ...additions]
    }

    if (ast.links) {
        return Object
            .entries(ast.links)
            .flatMap(e => {
                const ezero = e[0].replaceAll('-', '_').replaceAll(':', '_aka_').replaceAll('"', "quote") + random()
                return [...additions, [astName, ezero], ...astToEdgeList(e[1], ezero, edges)]
            })
    }

    if (ast.list) {
        const list = ast.list.flatMap(x => astToEdgeList(x, astName, edges))
        return [...additions, ...edges, [astName, list.toString().replaceAll(',', '')]]
    }

    return []
}

function random() {
    return parseInt(100000 * Math.random() + '')
}