import { ask } from "./ask.ts";
import { decompress } from "./decompress.ts";
import { definitionOf } from "./definitionOf.ts";
import { evalArgs } from "./evalArgs.ts";
import { removeImplicit } from "./removeImplicit.ts";
import { tell } from "./tell.ts";
import { KnowledgeBase, LLangAst, WorldModel } from "./types.ts";

export function evaluate(ast: LLangAst, kb: KnowledgeBase, args: { asIs: boolean } = { asIs: false }): {
    kb: KnowledgeBase,
    result: LLangAst,
    additions: WorldModel,
    eliminations: WorldModel,
} {
    const ast1 = ast.type === 'command' ? ast.f1 : ast
    const f = ast.type === 'command' ? tell : ask
    if (args.asIs) return { additions: [], eliminations: [], ...f(ast, kb) }
    const { ast: ast2, kb: kb1 } = translate(ast1, kb)
    return {
        additions: [],
        eliminations: [],
        ...f(ast2, kb1),
    }
}

function translate(ast: LLangAst, kb: KnowledgeBase): { ast: LLangAst, kb: KnowledgeBase } {
    const { rast, kb: kb1 } = evalArgs(ast, kb)
    const when = definitionOf(rast, kb1)
    if (when) return translate(when, kb1)
    const rast2 = decompress(rast)
    const rast3 = removeImplicit(rast2) // put before "definitionOf"
    return { ast: rast3, kb: kb1 }
}
