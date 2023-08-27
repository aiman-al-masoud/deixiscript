import { ImplicitReference, Conjunction, Disjunction, LLangAst, Variable, isLLangAst } from "./types.ts"

export function findAsts(ast: LLangAst, ...types: LLangAst['type'][]): LLangAst[]
export function findAsts(ast: LLangAst, type: 'variable'): Variable[]
export function findAsts(ast: LLangAst, type: 'conjunction'): Conjunction[]
export function findAsts(ast: LLangAst, type: 'disjunction'): Disjunction[]
export function findAsts(ast: LLangAst, type: 'implicit-reference'): ImplicitReference[]
// export function findAsts(ast: LLangAst, type: LLangAst['type']): LLangAst[]


export function findAsts(ast: LLangAst, ...types: LLangAst['type'][]): LLangAst[] {

    const subs = Object.values(ast).filter(isLLangAst)

    // if (ast.type === type) return [ast]
    if (types.includes(ast.type)) return [ast]

    return subs.flatMap(x => findAsts(x, ...types))

}