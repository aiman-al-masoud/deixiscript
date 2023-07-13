import { Anaphor, Conjunction, Disjunction, Equality, LLangAst, Variable, isLLangAst } from "./types.ts"


export function findAst(ast: LLangAst, type: 'variable'): Variable[]

export function findAst(ast: LLangAst, type: 'conjunction'): Conjunction[]
export function findAst(ast: LLangAst, type: 'disjunction'): Disjunction[]
export function findAst(ast: LLangAst, type: 'anaphor', maxNesting: number): Anaphor[]
export function findAst(ast: LLangAst, type: 'equality'): Equality[]
export function findAst(ast: LLangAst, type: LLangAst['type'], maxNesting?: number): LLangAst[]

export function findAst(ast: LLangAst, type: LLangAst['type'], maxNesting = 10): LLangAst[] {

    const subs = Object.values(ast).filter(isLLangAst)

    if (typeof type === 'string' && ast.type === type) return [ast]

    if (maxNesting <= 0) return []

    return subs.flatMap(x => findAst(x, type, maxNesting - 1))

}