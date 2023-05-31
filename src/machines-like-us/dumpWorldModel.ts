import { $ } from "./exp-builder.ts";
import { match } from "./match.ts";
import { substAll } from "./subst.ts";
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

        case 'conjunction':
            return dumpWorldModel(ast.f1, kb).concat(dumpWorldModel(ast.f2, kb))
    }

    for (const dc of kb.derivClauses) {

        const map = match(dc.conseq, ast)

        if (map) {
            const whenn = substAll(dc.when, map)
            return dumpWorldModel(whenn, kb)
        }
        // if (!map) {
        //     return false
        // }
    }

    // kb.derivClauses.some(dc => {

    //     const map = match(dc.conseq, ast)

    //     if (!map) {
    //         return false
    //     }

    //     const whenn = substAll(dc.when, map)

    // })

    throw new Error('not implemented! ' + ast.type)
}


console.log(dumpWorldModel($('x').isa('y').$, { wm: [], derivClauses: [] }))
console.log(dumpWorldModel($('x').has('capra').as('y').$, { wm: [], derivClauses: [] }))

console.log(dumpWorldModel($({ isStupid: 'capra' }).$, {
    wm: [],
    derivClauses: [
        $({ isStupid: 'x:thing' }).when(
            $('x:thing').has('stupid').as('intelligence')
                .and($('x:thing').has('crazy').as('status'))
        ).$
    ]
})
)
