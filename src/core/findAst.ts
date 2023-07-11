import { LLangAst, isLLangAst } from "./types.ts"

export function findAst(ast: LLangAst,
    type: LLangAst['type'] | ((ast: LLangAst) => boolean)
): LLangAst[] {

    const subs = Object.values(ast).filter(isLLangAst)

    if (typeof type === 'string' && ast.type === type) return [ast]

    if (typeof type === 'function' && type(ast)) return [ast]

    return subs.flatMap(x => findAst(x, type))

}