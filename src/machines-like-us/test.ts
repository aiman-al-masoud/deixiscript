import { isConst, KnowledgeBase, atomsEqual, isHasSentence, LLangAst } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { getConceptsOf, getSupers } from "./wm-funcs.ts";
import { match } from "./match.ts";
// import { $ } from "./exp-builder.ts";

export function test(formula: LLangAst, kb: KnowledgeBase): boolean {

    // recompute kb in case formula has an "after" clause.
    // remove after clause from formula and go on...
    // how about match() returning undefined if formula doesn't have after after and template does?

    switch (formula.type) {
        case 'boolean':
            return formula.value
        case 'equality':
            if (atomsEqual(formula.t1, formula.t2)) return true
            break
        case 'is-a-formula':
            if (isConst(formula.t2) && formula.t2.value === 'thing') return true
            if (isConst(formula.t2) && formula.t1.type === formula.t2.value) return true

            if (
                isConst(formula.t1)
                && isConst(formula.t2)
                && (getConceptsOf(formula.t1.value, kb.wm).includes(formula.t2.value) || getSupers(formula.t1.value, kb.wm).includes(formula.t2.value))
            ) return true
            break
        case 'has-formula':
            if (kb.wm.filter(isHasSentence).find(hs => {
                return isConst(formula.t1)
                    && isConst(formula.t2)
                    && isConst(formula.as)
                    && formula.t1.value === hs[0]
                    && formula.t2.value === hs[1]
                    && formula.as.value === hs[2]
            })) return true
            break
        case 'negation':
            if (!test(formula.f1, kb)) return true
            break
        case 'conjunction':
            if (test(formula.f1, kb) && test(formula.f2, kb)) return true
            break
        case 'disjunction':
            if (test(formula.f1, kb) || test(formula.f2, kb)) return true
            break
        case 'existquant':
            if (findAll(formula.where, [formula.variable], kb).length) return true
            break
        case 'if-else':
            return test(formula.condition, kb) ? test(formula.then, kb) : test(formula.otherwise, kb)
        case 'greater-than':
            if (
                formula.greater.type === 'number'
                && formula.lesser.type === 'number'
            ) return formula.greater.value > formula.lesser.value

    }

    return kb.derivClauses.some(dc => {
        const map = match(dc.conseq, formula)

        // TODO: pass down new state of the world to correctly evaluate sequences of events

        if (!map) {
            return false
        }

        const whenn = substAll(dc.when, map)
        // console.log('dc.conseq=', dc.conseq, 'formula=', formula, 'map=', map, 'whenn=', JSON.stringify(whenn))
        return test(whenn, kb)
    })

}
