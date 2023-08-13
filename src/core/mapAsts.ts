import { valueIs } from "../utils/valueIs.ts";
import { LLangAst, isLLangAst } from "./types.ts";

export function mapAsts(
    ast: LLangAst,
    fn: (x: LLangAst) => LLangAst,
    params?: { top?: boolean, lvl?: number },
): LLangAst {

    const args = {
        top: true,
        lvl: 0,
        ...params,
    }

    const entries = Object.entries(ast)
        .filter(valueIs(isLLangAst))

    const newEntries =
        entries.map(e => [e[0], mapAsts(e[1], fn, { ...args, lvl: args.lvl + 1 })])

    const nucleus = {
        ...ast,
        ...Object.fromEntries(newEntries),
    }

    return args.lvl !== 0 || args.top ? fn(nucleus) : nucleus

}