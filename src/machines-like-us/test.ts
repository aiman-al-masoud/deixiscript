import { isConst, KnowledgeBase, atomsEqual, isHasSentence, LLangAst, isFormulaWithAfter, Formula } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { getSupersAndConceptsOf } from "./wm-funcs.ts";
import { match } from "./match.ts";
import { recomputeKb } from "./recomputeKb.ts";
import { resolveAnaphor } from "./getAnaphor.ts";

export function test(formula: LLangAst, kb: KnowledgeBase, preComputeKb = true): boolean {

    if (preComputeKb && isFormulaWithAfter(formula) && formula.after.type === 'list-literal' && formula.after.list.length && formula.after.list.every(isConst)) {
        const events = formula.after.list.map(x => x.value)
        const kb2 = recomputeKb(events, kb)
        const formula2: Formula = { ...formula, after: { type: 'list-literal', list: [] } }
        return test(formula2, kb2, false)
    }

    switch (formula.type) {
        case 'boolean':
            return formula.value
        case 'equality':

            const t10 = resolveAnaphor(formula.t1, kb)
            const t20 = resolveAnaphor(formula.t2, kb)

            if (atomsEqual(t10, t20)) return true
            break
        case 'is-a-formula':

            const t1 = resolveAnaphor(formula.t1, kb)
            const t2 = resolveAnaphor(formula.t2, kb)

            if (isConst(t2) && t2.value === 'thing') return true
            if (isConst(t2) && t1.type === t2.value) return true

            if (
                isConst(t1)
                && isConst(t2)
                && getSupersAndConceptsOf(t1.value, kb.wm).includes(t2.value)
            ) return true
            break
        case 'has-formula':

            const t11 = resolveAnaphor(formula.t1, kb)
            const t22 = resolveAnaphor(formula.t2, kb)
            const as = resolveAnaphor(formula.as, kb)

            if (kb.wm.filter(isHasSentence).find(hs => {

                return isConst(t11)
                    && isConst(t22)
                    && isConst(as)
                    && t11.value === hs[0]
                    && t22.value === hs[1]
                    && as.value === hs[2]
            })) return true
            break
        case 'greater-than':

            const greater = resolveAnaphor(formula.greater, kb)
            const lesser = resolveAnaphor(formula.lesser, kb)

            if (
                greater.type === 'number'
                && lesser.type === 'number'
            ) return greater.value > lesser.value
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
        const map = match(dc.conseq, formula)

        if (!map) {
            return false
        }

        const whenn = substAll(dc.when, map)
        return test(whenn, kb)
    })

}

