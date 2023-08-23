import { ask } from "./ask.ts";
import { decompress } from "./decompress.ts";
import { definitionOf } from "./definitionOf.ts";
import { evalArgs } from "./evalArgs.ts";
import { $ } from "./exp-builder.ts";
import { findAsts } from "./findAsts.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { tell } from "./tell.ts";
import { KnowledgeBase, LLangAst, WorldModel } from "./types.ts";

export function evaluate(ast: LLangAst, kb: KnowledgeBase): {
    kb: KnowledgeBase,
    result: LLangAst,
    additions: WorldModel,
    eliminations: WorldModel,
} {
    const x = ast.type === 'command' ? ast.f1 : ast
    const f = ast.type === 'command' ? tell : ask
    return execAst(x, kb, f)
}

function execAst(ast: LLangAst, kb: KnowledgeBase, f: typeof tell | typeof ask) {

    const { rast, kb: kb1 } = evalArgs(ast, kb)
    const when = definitionOf(rast, kb1)
    if (when) return execAst(when, kb1, f)
    const rast2 = decompress(rast)
    const rast3 = findAsts(rast2, 'when-derivation-clause').length ? rast2 : removeImplicit(rast2)

    return {
        result: $(true).$,
        additions: [],
        eliminations: [],
        ...f(rast3, kb1),
    }
}

