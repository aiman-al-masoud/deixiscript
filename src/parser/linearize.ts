
import { isNotNullish } from "../utils/isNotNullish.ts";
import { AstNode, Member, Syntax, SyntaxMap } from "./types.ts";

/**
 * Convert an AST to its textual representation in a given grammar.
 */
export function linearize(ast: AstNode, syntaxMap: SyntaxMap): string {
    if (typeof ast !== 'object') return ast + ''
    if (ast instanceof Array) return ast + ''
    if (!ast.type) throw new Error('')
    const result = linearizeSyntax(syntaxMap[ast.type], syntaxMap, ast)
    if (result === undefined) return ''
    return result
}

function linearizeSyntax(
    syntax: Syntax,
    syntaxMap: SyntaxMap,
    ast: AstNode,
): string | undefined {
    const pieces = syntax.map(m => linearizeMember(m, syntaxMap, ast))
    if (!pieces.every(isNotNullish)) return undefined
    return pieces.reduce((a, b) => a + b, '')
}

function linearizeMember(
    member: Member,
    syntaxMap: SyntaxMap,
    ast: AstNode,
): string | undefined {

    if (typeof ast !== 'object' || ast instanceof Array) return ast + ''

    if (member.literals) {
        return member.literals[0]
    }

    if (member.role && ast[member.role] !== undefined) {
        return linearize(ast[member.role], syntaxMap)
    }

    if (member.role && ast[member.role] === undefined) {
        return undefined
    }

    if (member.types) {

        for (const t of member.types) {
            const s = syntaxMap[t]
            if (s === undefined) throw new Error('')
            const z = linearizeSyntax(s, syntaxMap, ast)
            if (z !== undefined) return z
        }

    }

    return ''
}
