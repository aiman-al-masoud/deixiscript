import { Anaphor, Conjunction, Disjunction, Equality, LLangAst, isLLangAst } from "./types.ts"


export function findAst(ast: LLangAst, type: 'conjunction'): Conjunction[]
export function findAst(ast: LLangAst, type: 'disjunction'): Disjunction[]
export function findAst(ast: LLangAst, type: 'anaphor'): Anaphor[]
export function findAst(ast: LLangAst, type: 'equality'): Equality[]
export function findAst(ast: LLangAst, type: LLangAst['type']): LLangAst[]

export function findAst(ast: LLangAst, type: LLangAst['type']): LLangAst[] {

    const subs = Object.values(ast).filter(isLLangAst)

    if (typeof type === 'string' && ast.type === type) return [ast]

    return subs.flatMap(x => findAst(x, type))

}