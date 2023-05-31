import { $ } from "./exp-builder.ts";
import { isConst, KnowledgeBase, LLangAst, WorldModel } from "./types.ts";

export function dumpWorldModel(ast: LLangAst, kb: KnowledgeBase): WorldModel {

    switch (ast.type) {
        case 'has-formula':
            if (isConst(ast.t1) && isConst(ast.t2) && isConst(ast.as)) {
                return [
                    [ast.t1.value, ast.t2.value, ast.as.value]
                ]
            }
            return []
        case 'is-a-formula':
            if (isConst(ast.t1) && isConst(ast.t2)) {
                return [
                    [ast.t1.value, ast.t2.value]
                ]
            }
            return []

    }

    throw new Error('not implemented!')
}


// console.log(dumpWorldModel($('x').isa('y').$, { wm: [], derivClauses: [] }))
// console.log(dumpWorldModel($('x').has('capra').as('y').$, { wm: [], derivClauses: [] }))
