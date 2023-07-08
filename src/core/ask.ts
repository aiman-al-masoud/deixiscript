import { isConst, KnowledgeBase, atomsEqual, isHasSentence, LLangAst, isFormulaWithAfter, Formula, Atom } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { addWorldModels, getSupersAndConceptsOf } from "./wm-funcs.ts";
import { match } from "./match.ts";
import { getAnaphor, } from "./getAnaphor.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";

export function ask(
    formula: LLangAst,
    kb: KnowledgeBase,
    opts = { preComputeKb: true, storeDeixis: true },
): {
    result: Atom,
    kb: KnowledgeBase,
} {

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
            return { result: formula, kb }
        case 'number':
        case 'entity':
        case 'string':
            const lastTime = Math.max(...Object.values(kb.deicticDict).concat(0))
            const deicticDict = opts.storeDeixis ? { ...kb.deicticDict, [formula.value]: lastTime + 1 } : kb.deicticDict
            return { result: formula, kb: { ...kb, deicticDict } }
        case 'variable':
        case 'list-literal':
        case 'list-pattern':
            return { result: formula, kb }
        case 'anaphor':
            return ask(getAnaphor(formula, kb)!, kb, opts)
        case 'equality':
            const t10 = ask(formula.t1, kb, opts).result
            const t20 = ask(formula.t2, kb, opts).result
            if (atomsEqual(t10, t20)) return { result: $(true).$, kb }

            break
        case 'is-a-formula':

            if (formula.t1.type === 'conjunction') {
                return ask($(formula.t1.f1).isa(formula.t2).and($(formula.t1.f2).isa(formula.t2)).$, kb)
            }

            if (formula.t2.type === 'conjunction') {
                return ask($(formula.t1).isa(formula.t2.f1).and($(formula.t1).isa(formula.t2.f2)).$, kb)
            }

            if (formula.t1.type === 'disjunction') {
                return ask($(formula.t1.f1).isa(formula.t2).or($(formula.t1.f2).isa(formula.t2)).$, kb)
            }

            if (formula.t2.type === 'disjunction') {
                return ask($(formula.t1).isa(formula.t2.f1).or($(formula.t1).isa(formula.t2.f2)).$, kb)
            }

            const t1 = ask(formula.t1, kb, opts).result
            const t2 = ask(formula.t2, kb, opts).result

            if (t1.type === t2.value) return { result: $(true).$, kb }

            if (
                isConst(t1) && isConst(t2)
                && getSupersAndConceptsOf(t1.value, kb.wm).includes(t2.value)
            ) return { result: $(true).$, kb }
            break
        case 'has-formula':

            const t11 = ask(formula.t1, kb, opts).result
            const t22 = ask(formula.t2, kb, opts).result
            const as = ask(formula.as, kb, opts).result

            if (kb.wm.filter(isHasSentence).find(hs => {
                return t11.value === hs[0]
                    && t22.value === hs[1]
                    && as.value === hs[2]
            })) return { result: $(true).$, kb }
            break
        case 'negation':
            if (!ask(formula.f1, kb, opts).result.value) return { result: $(true).$, kb }
            break
        case 'conjunction':
            if (ask(formula.f1, kb, opts).result.value && ask(formula.f2, kb, opts).result.value) return { result: $(true).$, kb }
            break
        case 'disjunction':
            if (ask(formula.f1, kb, opts).result.value || ask(formula.f2, kb, opts).result.value) return { result: $(true).$, kb }
            break
        case 'existquant':
            if (findAll(formula.where, [formula.variable], kb).length) return { result: $(true).$, kb }
            break
        case 'if-else':
            return ask(formula.condition, kb, opts).result.value ? ask(formula.then, kb, opts) : ask(formula.otherwise, kb, opts)
        case 'math-expression':
            const left = ask(formula.left, kb, opts).result.value as number
            const right = ask(formula.right, kb, opts).result.value as number

            const result = {
                '+': $(left + right).$,
                '-': $(left - right).$,
                '*': $(left * right).$,
                '/': $(left / right).$,
                '>': $(left > right).$,
                '<': $(left < right).$,
            }[formula.operator]

            return ask(
                result,
                {
                    ...kb,
                    wm: addWorldModels(kb.wm, [[result.value, 'thing']]),
                }
            )

    }

    const result = kb.derivClauses.some(dc => {
        const map = match(dc.conseq, formula)

        if (!map) {
            return false
        }

        const whenn = substAll(dc.when, map)
        return ask(whenn, kb, opts).result.value
    })

    return { result: $(result).$, kb }

}

