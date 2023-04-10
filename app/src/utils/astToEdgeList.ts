import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { uniq } from "./uniq";

export function astToEdgeList(ast: AstNode, parent?: string, edges: [string, string][] = [], nesting = 0, partOfName = ''): [string, string][] {

    !parent ? console.log(ast) : 0

    const astName = ((partOfName ? partOfName + ':' : '') + (ast.role ?? ast.lexeme?.root ?? ast.type) + '_' + nesting /* nesting */).replaceAll('-', '_').replaceAll(':', '_aka_').replaceAll('"', "quote")

    if (!ast.links && !ast.list && parent) { // leaf! It has to have a parent!
        return [...edges, [parent, astName]]
    }

    if (ast.links) {

        const id = parseInt(100 * Math.random() + '')

        return Object
            .entries(ast.links)
            .flatMap(e => [...(parent ? [[parent, astName] as [string, string]] : []), ...astToEdgeList(e[1], astName, edges, id /* nesting + 1 */, e[0])])
    }

    if (ast.list) {

        const id = parseInt(100 * Math.random() + '')

        const c = ast.list.flatMap(x => astToEdgeList(x, astName, edges, id /* nesting + 1 */))
        return [...(parent ? [[parent, astName] as [string, string]] : []), ...edges, [astName, c.toString().replaceAll(',', '')]]
    }

    return []
}

export function astToGraphViz(ast: AstNode) {

    return uniq(astToEdgeList(ast)).map(x => x[0] + ' -> ' + x[1] + ' ;').reduce((a, b) => a + '\n' + b, '')

}

