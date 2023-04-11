import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { uniq } from "./uniq";


type EdgeList = [string, string][]

function astToEdgeList(
    ast: AstNode,
    parentName?: string,
    edges: EdgeList = [],
    childPrefix = 0,
    partOfName = ''): EdgeList {

    // !parent ? console.log(ast) : 0

    const astName = ((partOfName ? partOfName + ':' : '') + (ast.role ?? ast.lexeme?.root ?? ast.type) + '_' + childPrefix).replaceAll('-', '_').replaceAll(':', '_aka_').replaceAll('"', "quote")
    const newChildPrefix = parseInt(100 * Math.random() + '')

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
            .flatMap(e => [...additions, ...astToEdgeList(e[1], astName, edges, newChildPrefix, e[0])])
    }

    if (ast.list) {
        const list = ast.list.flatMap(x => astToEdgeList(x, astName, edges, newChildPrefix))
        return [...additions, ...edges, [astName, list.toString().replaceAll(',', '')]]
    }

    return []
}

export function astToGraphViz(ast: AstNode) {
    return uniq(astToEdgeList(ast)).map(x => x[0] + ' -> ' + x[1] + ' ;').reduce((a, b) => a + '\n' + b, '')
}

function removeForbiddenChars(string: string, forbidden: { [x: string]: string }): string {
    return Object.entries(forbidden).reduce((a, b) => a.replaceAll(b[0], b[1]), string)
}

