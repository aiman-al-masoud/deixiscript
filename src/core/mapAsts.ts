import { LLangAst, isLLangAst } from "./types.ts";

export function mapAsts(ast: LLangAst, fn: (x: LLangAst) => LLangAst, top = true, lvl = 0): LLangAst {

    const entries = Object.entries(ast)
        .filter((e): e is [string, LLangAst] => isLLangAst(e[1]))

    const newEntries =
        entries.map(e => [e[0], mapAsts(e[1], fn, top, lvl + 1)])

    const nucleus = {
        ...ast,
        ...Object.fromEntries(newEntries),
    }

    return lvl !== 0 || top ? fn(nucleus) : nucleus

}