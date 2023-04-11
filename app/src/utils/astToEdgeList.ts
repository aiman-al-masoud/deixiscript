import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { uniq } from "./uniq";


type EdgeList = [string, string][]

function astToEdgeList(
    ast: AstNode,
    parentName?: string,
    edges: EdgeList = [],
): EdgeList {

    // !parent ? console.log(ast) : 0

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

export function astToGraphViz(ast: AstNode) {
    const edges = uniq(astToEdgeList(ast))
    const labels = uniq(edges.flat()).map(x => x + '[label="' + x.replaceAll(/\d+/g, '') + '"' + '];')
    return labels.concat(edges.map(x => x[0] + ' -> ' + x[1] + ' ;')).reduce((a, b) => a + '\n' + b, '')
}

function removeForbiddenChars(string: string, forbidden: { [x: string]: string }): string {
    return Object.entries(forbidden).reduce((a, b) => a.replaceAll(b[0], b[1]), string)
}

function random() {
    return parseInt(1000 * Math.random() + '')
}