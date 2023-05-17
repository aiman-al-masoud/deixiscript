import { AtomicFormula, isConst, isVar, KnowledgeBase, Atom, VarMap, isTerm, isListLiteral, atomsEqual, Variable, isHasSentence, Ast, isAtomicFormula } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { getSupers } from "./wm-funcs.ts";
import { deepMapOf } from "../utils/DeepMap.ts";

export function test(formula: Ast, kb: KnowledgeBase): boolean {

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

        const map = match(dc.conseq, formula)

        if (!map) {
            return false
        }

        const qPrime = substAll(dc.when, map)
        // console.log('qPrime=', JSON.stringify(qPrime))
        // console.log('--------------------')

        return test(qPrime, kb)
    })

}

function match(template: AtomicFormula, f: AtomicFormula): VarMap | undefined {

    if (!isListLiteral(f.after)) {
        return undefined
    }

    const fAfter = f.after
    let afterMap: VarMap

    if (isAtomTruthy(template.after) && !isAtomTruthy(f.after)) {
        return undefined
    }

    if (isVar(template.after)) {
        afterMap = deepMapOf([[template.after, { type: 'list-literal', list: fAfter.list.slice(0, -1) }]])
    } else if (isConst(template.after) || template.after.type === 'boolean') {
        afterMap = deepMapOf()
    } else if (template.after.type === 'list-literal') {
        afterMap = deepMapOf(template.after.list
            .filter(isVar)
            .map((x, i) => [x, fAfter.list[i]]))
    } else {
        afterMap = deepMapOf([[template.after.seq, { type: 'list-literal', list: fAfter.list.slice(0, -1) }], [template.after.tail, fAfter.list.at(-1)!]])
    }

    const templateTerms = [template.t1, template.t2, ...(template.type === 'has-formula' ? [template.as] : [])]
    const fTerms = [f.t1, f.t2, ...(f.type === 'has-formula' ? [f.as] : [])]

    const zipped = templateTerms.map((x, i) => [x, fTerms[i]] as const)
    const disagree = zipped.some(e => (!e[0] || !e[1]) || isConst(e[0]) && isConst(e[1]) && !atomsEqual(e[0], e[1]))
    const reduced = zipped.filter(e => e[0] !== e[1]).filter(e => isVar(e[0])) as [Variable, Atom][]

    if (!disagree) {
        return deepMapOf([...afterMap, ...reduced])
    }

}

function isAtomTruthy(atom: Atom) {

    if (isTerm(atom)) {
        return !!atom
    } else if (atom.type === 'list-literal') {
        return !!atom.list.length
    } else {
        return !!atom
    }
}