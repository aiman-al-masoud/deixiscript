import { LLangAst, isLLangAst } from "./types.ts";

export function mapAsts(
    ast: LLangAst,
    fn: (x: LLangAst) => LLangAst,
    args?: { top?: boolean, lvl?: number },
): LLangAst {

    const pars = {
        top: true,
        lvl: 0,
        ...args,
    }

    const entries = Object.entries(ast)
        .filter((e): e is [string, LLangAst] => isLLangAst(e[1]))

    const newEntries =
        entries.map(e => [e[0], mapAsts(e[1], fn, { ...pars, lvl: pars.lvl + 1 })])

    const nucleus = {
        ...ast,
        ...Object.fromEntries(newEntries),
    }

    return pars.lvl !== 0 || pars.top ? fn(nucleus) : nucleus

}