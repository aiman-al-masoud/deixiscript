import { AstNode } from "./types.ts";

export function transform(ast: AstNode): AstNode {

    if (typeof ast !== 'object') return ast
    if (ast instanceof Array) return ast

    if (ast.wrap) {

        return {
            type: ast.wrap.of,
            [ast.wrap.role]: Object.fromEntries(Object.entries(ast).filter(e => e[0] !== 'wrap').map(e => [e[0], transform(e[1])])),
        }

    }

    return ast

}