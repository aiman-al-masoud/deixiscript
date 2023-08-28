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
    const { ast: ast2, kb: kb1 } = uglify(ast1, kb)

    return {
        additions: [],
        eliminations: [],
        ...f(ast2, kb1),
    }
}

function uglify(ast: LLangAst, kb: KnowledgeBase): { ast: LLangAst, kb: KnowledgeBase } {
    const ast1 = removeImplicit(ast)
    const { rast: ast2 } = evalArgs(ast1, kb)
    const { kb: kb1 } = evalArgs(ast, kb)
    const when = definitionOf(ast2, kb1)
    if (when) return uglify(when, kb1)
    const ast3 = decompress(ast2)
    return { ast: ast3, kb: kb1 }
}
