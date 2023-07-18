
import { first } from "../utils/first.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";
import { AstNode, Member, Syntax, SyntaxMap } from "./types.ts";


export function linearize(ast: AstNode, syntaxMap: SyntaxMap): string {
    // console.log('linearize()', 'ast=', ast)
    // console.log('--------------------------')
    if (typeof ast !== 'object') return ast + ''
    if (ast instanceof Array) return ast + ''
    if (!ast.type) throw new Error('')
    const result = linearizeSyntax(syntaxMap[ast.type], syntaxMap, ast)
    // if (result===undefined) return '' /* throw new Error('') */
    return result
}

export function linearizeSyntax(
    syntax: Syntax,
    syntaxMap: SyntaxMap,
    ast: AstNode,
): string {
    // console.log('linearizeSyntax()', 'ast=', ast, 'syntax=', syntax)
    // console.log('--------------------------')
    // return syntax.reduce((s, m) => s + linearizeMember(m, syntaxMap, ast), '')
    const pieces = syntax.map(m => linearizeMember(m, syntaxMap, ast))
    if (!pieces.every(isNotNullish)) return ''
    return pieces.reduce((a, b) => a + b, '')
}

export function linearizeMember(
    member: Member,
    syntaxMap: SyntaxMap,
    ast: AstNode,
): string | undefined {

    // console.log('linearizeMember()', 'ast=', ast, 'member=', member)

    if (typeof ast !== 'object' || ast instanceof Array) return ast + ''

    if (member.literals) {
        // console.log('member.literals=', member.literals[0])
        // console.log('--------------------------')
        return member.literals[0]
    }

    if (member.role && ast[member.role] !== undefined) {
        // console.log('member.role=', member.role)
        // console.log('--------------------------')
        return linearize(ast[member.role], syntaxMap)
    }

    if (member.role && ast[member.role] === undefined) {
        return undefined
    }

    if (member.types /* && !member.expand */) {
        // console.log('member.types=', member.types[0])
        // console.log('--------------------------')

        // const s = syntaxMap[member.types[0]]
        // if (s === undefined) throw new Error('')
        // return linearizeSyntax(s, syntaxMap, ast)

        // return first(member.types, t =>  {
        //     const s = syntaxMap[t]
        //     if (s===undefined) return undefined
        //     return linearizeSyntax(s, syntaxMap, ast)
        // })

        for (const t of member.types) {
            const s = syntaxMap[t]
            if (s === undefined) throw new Error('')
            const z = linearizeSyntax(s, syntaxMap, ast)
            if (z !== '') return z
        }

    }

    return ''

}
