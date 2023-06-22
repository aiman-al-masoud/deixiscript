import { match } from "./match.ts";
import { substAll } from "./subst.ts";
import { isConst, KnowledgeBase, LLangAst } from "./types.ts";

export function dump(ast: LLangAst, kb: KnowledgeBase): KnowledgeBase {

    switch (ast.type) {
        case 'has-formula':
            if (isConst(ast.t1) && isConst(ast.t2) && isConst(ast.as)) {
                return {
                    derivClauses: kb.derivClauses,
                    wm: [...kb.wm, [ast.t1.value, ast.t2.value, ast.as.value]]
                }
            }
            return kb
        case 'is-a-formula':
            if (isConst(ast.t1) && isConst(ast.t2)) {

                return {
                    derivClauses: kb.derivClauses,
                    wm: [...kb.wm, [ast.t1.value, ast.t2.value]]
                }
            }
            return kb
        case 'conjunction':
            const kb1 = dump(ast.f1, kb)
            const kb2 = dump(ast.f2, kb)
            return {
                wm: kb1.wm.concat(kb2.wm),
                derivClauses: kb1.derivClauses.concat(kb2.derivClauses),
            }
        case 'derived-prop':
            return {
                wm: kb.wm,
                derivClauses: [...kb.derivClauses, ast]
            }


    }

    for (const dc of kb.derivClauses) {

        const map = match(dc.conseq, ast)

        if (map) {
            const whenn = substAll(dc.when, map)
            return dump(whenn, kb)
        }
    }

    throw new Error('not implemented! ' + ast.type)
}


// import { $ } from "./exp-builder.ts";
// console.log(dumpWorldModel($('x').isa('y').$, { wm: [], derivClauses: [] }))
// console.log(dumpWorldModel($('x').has('capra').as('y').$, { wm: [], derivClauses: [] }))
// console.log(dumpWorldModel($({ isStupid: 'capra' }).$, {
//     wm: [],
//     derivClauses: [
//         $({ isStupid: 'x:thing' }).when(
//             $('x:thing').has('stupid').as('intelligence')
//                 .and($('x:thing').has('crazy').as('status'))
//         ).$
//     ]
// })
// )
