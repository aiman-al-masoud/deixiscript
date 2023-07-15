import { isConst, KnowledgeBase, isHasSentence, LLangAst, isFormulaWithAfter, Atom, astsEqual } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { subst } from "./subst.ts";
import { addWorldModels, getConceptsOf } from "./wm-funcs.ts";
import { match } from "./match.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { decompress } from "./decompress.ts";
import { removeAnaphors } from "./removeAnaphors.ts";
import { isNotNullish } from "../utils/isNotNullish.ts";

export function ask(
    ast: LLangAst,
    kb: KnowledgeBase,
    opts = { preComputeKb: true, storeDeixis: true },
): {
    result: Atom,
    kb: KnowledgeBase,
} {

    if (opts.preComputeKb
        && isFormulaWithAfter(ast)
        && ast.after.type === 'list-literal'
        && ast.after.value.length
        && ast.after.value.every(isConst)) {

        const events = ast.after.value.map(x => x.value)
        const eventSentences = events.map(x => $(x).happens.$)
        const kb2 = eventSentences.reduce((a, b) => tell(b, a).kb, kb)
        const formula = subst(ast, [ast.after, $([]).$])
        return ask(formula, kb2, { ...opts, preComputeKb: false })
    }

    const formula = removeAnaphors(decompress(ast))

    switch (formula.type) {

        case 'boolean':
        case 'anything':
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
            throw new Error('!!!!')
        case 'equality':
            const t10 = ask(formula.t1, kb, opts).result
            const t20 = ask(formula.t2, kb, opts).result
            if (astsEqual(t10, t20)) return { result: $(true).$, kb }
            break
        case 'is-a-formula':
            const t1 = ask(formula.t1, kb, opts).result
            const t2 = ask(formula.t2, kb, opts).result

            if (t1.type === t2.value) return { result: $(true).$, kb }

            if (
                isConst(t1) && isConst(t2)
                && getConceptsOf(t1.value, kb.wm).includes(t2.value)
            ) return { result: $(true).$, kb }
            break
        case 'has-formula':

            const t11 = ask(formula.t1, kb, opts).result
            const t22 = ask(formula.t2, kb, opts).result
            const as = ask(formula.as, kb, opts).result

            if (kb.wm.filter(isHasSentence).find(hs => {
                return t11.value === hs[0]
                    && t22.value === hs[1]
                    && (as.value === hs[2] || as.type === 'anything')
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
            const thing = ask(formula.value, kb).result
            if (thing.type !== 'nothing') return { result: $(true).$, kb }
            break
        case 'arbitrary-type':

            const maps = findAll(formula.description, [formula.head], kb)
            const candidates = maps.map(x => x.get(formula.head)).filter(isNotNullish)
            candidates.sort(
                (c1, c2) => (kb.deicticDict[c2.value as string] ?? 0) - (kb.deicticDict[c1.value as string] ?? 0)
            )

            const res = candidates.at(0)

            if (res) {
                return ask(res, kb, opts)
            } else {
                return { result: $('nothing').$, kb }
            }

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
        if (!map) return false

        const whenn = subst(dc.when, map)
        return ask(whenn, kb, opts).result.value
    })

    return { result: $(result).$, kb }

}
