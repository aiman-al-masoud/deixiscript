import { match } from "./match.ts";
import { subst } from "./subst.ts";
import { tell } from "./tell.ts";
import { LLangAst, KnowledgeBase, WorldModel, isFormulaWithNonNullAfter } from "./types.ts";

/* 
EXPERIMENT
*/

function consequencesOfNew(ast: LLangAst, kb: KnowledgeBase): WorldModel {
    
    const changes = kb.derivClauses.flatMap(dc => {

        if (isFormulaWithNonNullAfter(dc.conseq)) {
            
            const map = match(dc.conseq.after, ast)
            if (!map) return []
            
            const conseq = subst(dc.conseq, map)
            return tell(conseq, kb).additions
            
        }
        return []
    })
    
    return changes
}


// import { $ } from "./exp-builder.ts";

// const dc = $('screen#1').has('red').as('color').after($('x:button').has('down').as('state')).when(true).$

// const kb = $(dc)
//     .and($('button#1').isa('button'))
//     .dump().kb

// const a = $('button#1').has('down').as('state').$

// const result = consequencesOfNew(a, kb)

// console.log(result)



