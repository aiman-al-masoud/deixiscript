import { isConst, KnowledgeBase, atomsEqual, isHasSentence, LLangAst, isFormulaWithAfter, Formula, Atom } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { getSupersAndConceptsOf } from "./wm-funcs.ts";
import { match } from "./match.ts";
import { getAnaphor, } from "./getAnaphor.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";

export function ask(
    formula: LLangAst,
    kb: KnowledgeBase,
    opts = { preComputeKb: true, storeDeixis: true },
): Atom {

    if (opts.preComputeKb
        && isFormulaWithAfter(formula)
        && formula.after.type === 'list-literal'
        && formula.after.value.length
        && formula.after.value.every(isConst)) {

        const events = formula.after.value.map(x => x.value)
        const eventSentences = events.map(x => $(x).happens.$)
        const kb2 = eventSentences.reduce((a, b) => tell(b, a).kb, kb)
        const formula2: Formula = { ...formula, after: $([]).$ }
        return ask(formula2, kb2, { ...opts, preComputeKb: false })
    }

    switch (formula.type) {

        case 'boolean':
            return formula
        case 'number':
        case 'entity':
        case 'string':
            if (opts.storeDeixis) {
                const lastTime = Math.max(...Object.values(kb.deicticDict).concat(0))
                kb.deicticDict[formula.value] = lastTime + 1
            }
            return formula
        case 'variable':
        case 'list-literal':
        case 'list-pattern':
            return formula
        case 'anaphor':
            return ask(getAnaphor(formula, kb)!, kb, opts)
        case 'equality':
            const t10 = ask(formula.t1, kb, opts)
            const t20 = ask(formula.t2, kb, opts)
            if (atomsEqual(t10, t20)) return $(true).$

            break
        case 'is-a-formula':
            const t1 = ask(formula.t1, kb, opts)
            const t2 = ask(formula.t2, kb, opts)

            if (t1.type === t2.value) return $(true).$

            if (
                isConst(t1) && isConst(t2)
                && getSupersAndConceptsOf(t1.value, kb.wm).includes(t2.value)
            ) return $(true).$
            break
        case 'has-formula':
            const t11 = ask(formula.t1, kb, opts)
            const t22 = ask(formula.t2, kb, opts)
            const as = ask(formula.as, kb, opts)

            if (kb.wm.filter(isHasSentence).find(hs => {
                return t11.value === hs[0]
                    && t22.value === hs[1]
                    && as.value === hs[2]
            })) return $(true).$
            break
        case 'negation':
            if (!ask(formula.f1, kb, opts).value) return $(true).$
            break
        case 'conjunction':
            if (ask(formula.f1, kb, opts).value && ask(formula.f2, kb, opts).value) return $(true).$
            break
        case 'disjunction':
            if (ask(formula.f1, kb, opts).value || ask(formula.f2, kb, opts).value) return $(true).$
            break
        case 'existquant':
            if (findAll(formula.where, [formula.variable], kb).length) return $(true).$
            break
        case 'if-else':
            return ask(formula.condition, kb, opts).value ? ask(formula.then, kb, opts) : ask(formula.otherwise, kb, opts)
        case 'math-expression':
            const left = ask(formula.left, kb, opts).value as number
            const right = ask(formula.right, kb, opts).value as number

            return {
                '+': $(left + right).$,
                '-': $(left - right).$,
                '*': $(left * right).$,
                '/': $(left / right).$,
                '>': $(left > right).$,
                '<': $(left < right).$,
            }[formula.operator]

    }

    const result = kb.derivClauses.some(dc => {
        const map = match(dc.conseq, formula)

        if (!map) {
            return false
        }

        const whenn = substAll(dc.when, map)
        return ask(whenn, kb, opts).value
    })

    return $(result).$

}

