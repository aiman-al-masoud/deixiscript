import { Anaphor, Conjunction, Disjunction, Equality, LLangAst, Variable, isLLangAst } from "./types.ts"


export function findAsts(ast: LLangAst, type: 'variable'): Variable[]
export function findAsts(ast: LLangAst, type: 'conjunction'): Conjunction[]
export function findAsts(ast: LLangAst, type: 'disjunction'): Disjunction[]
export function findAsts(ast: LLangAst, type: 'anaphor'): Anaphor[]
export function findAsts(ast: LLangAst, type: 'equality'): Equality[]
export function findAsts(ast: LLangAst, type: LLangAst['type']): LLangAst[]

export function findAsts(ast: LLangAst, type: LLangAst['type']): LLangAst[] {

    const subs = Object.values(ast).filter(isLLangAst)

    if (ast.type === type) return [ast]

    // if (maxNesting <= 0){
    //     console.log('YES!')
    //     return []
    // }

    return subs.flatMap(x => findAsts(x, type, /* maxNesting - 1 */))

}