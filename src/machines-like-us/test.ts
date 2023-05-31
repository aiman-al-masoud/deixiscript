import { AtomicFormula, isConst, isVar, KnowledgeBase, Atom, VarMap, isListLiteral, atomsEqual, Variable, isHasSentence, LLangAst, isAtomicFormula, isAtomTruthy } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { getSupers } from "./wm-funcs.ts";
import { deepMapOf } from "../utils/DeepMap.ts";
import { match, oldMatch } from "./match.ts";

export function test(formula: LLangAst, kb: KnowledgeBase): boolean {

    console.log(formula)

    switch (formula.type) {
        case 'boolean':
            return formula.value
        case 'equality':
            {
                const t1 = atomsEqual(formula.t1, formula.t2)
                if (t1) return true
                break
            }
        case 'is-a-formula':
            if (
                isConst(formula.t1)
                && isConst(formula.t2)
                && getSupers(formula.t1.value, kb.wm).includes(formula.t2.value)
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
    }

    return kb.derivClauses.some(dc => {

        if (!isAtomicFormula(formula)) {
            return false
        }

        const map = oldMatch(dc.conseq, formula)
        // const map = match(dc.conseq, formula).at(0)

        // const newMap = match(dc.conseq, formula).at(0)
        // if (!!map !== !!newMap) console.log('oldMap=', map, 'newMap=', newMap, )

        if (!map) {
            return false
        }

        const qPrime = substAll(dc.when, map)
        // console.log('qPrime=', JSON.stringify(qPrime))
        // console.log('--------------------')

        return test(qPrime, kb)
    })

}
