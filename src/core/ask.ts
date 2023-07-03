import { isConst, KnowledgeBase, atomsEqual, isHasSentence, LLangAst, isFormulaWithAfter, Formula, WmAtom, Atom, Number } from "./types.ts";
import { findAll, } from "./findAll.ts";
import { substAll } from "./subst.ts";
import { getSupersAndConceptsOf } from "./wm-funcs.ts";
import { match } from "./match.ts";
import { getAnaphor, /* resolveAnaphor */ } from "./getAnaphor.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";

export function ask(formula: LLangAst, kb: KnowledgeBase, preComputeKb = true): Atom | WmAtom {

    if (preComputeKb
        && isFormulaWithAfter(formula)
        && formula.after.type === 'list-literal'
        && formula.after.value.length
        && formula.after.value.every(isConst)) {

        const events = formula.after.value.map(x => x.value)
        const eventSentences = events.map(x => $(x).happens.$)
        const kb2 = eventSentences.reduce((a, b) => tell(b, a).kb, kb)
        const formula2: Formula = { ...formula, after: $([]).$ }
        return ask(formula2, kb2, false)
    }

    switch (formula.type) {

        case 'boolean':
            return formula.value
        case 'number':
        case 'entity':
        case 'string':
            kb.deicticDict[formula.value] ??= 0
            kb.deicticDict[formula.value]++
            return formula
        case 'variable':
        case 'list-literal':
        case 'list-pattern':
            return formula
        case 'anaphor':
            return ask(getAnaphor(formula, kb)!, kb)
        case 'equality':

            const t10 = ask(formula.t1, kb) as Atom
            const t20 = ask(formula.t2, kb) as Atom
            if (atomsEqual(t10, t20)) return true

            break
        case 'is-a-formula':

            const t1 = ask(formula.t1, kb) as Atom
            const t2 = ask(formula.t2, kb) as Atom

            if (isConst(t2) && t1.type === t2.value) return true

            if (
                isConst(t1)
                && isConst(t2)
                && getSupersAndConceptsOf(t1.value, kb.wm).includes(t2.value)
            ) return true
            break
        case 'has-formula':

            const t11 = ask(formula.t1, kb) as Atom
            const t22 = ask(formula.t2, kb) as Atom
            const as = ask(formula.as, kb) as Atom

            if (kb.wm.filter(isHasSentence).find(hs => {

                return isConst(t11)
                    && isConst(t22)
                    && isConst(as)
                    && t11.value === hs[0]
                    && t22.value === hs[1]
                    && as.value === hs[2]
            })) return true
            break
        case 'negation':
            if (!ask(formula.f1, kb)) return true
            break
        case 'conjunction':
            if (ask(formula.f1, kb) && ask(formula.f2, kb)) return true
            break
        case 'disjunction':
            if (ask(formula.f1, kb) || ask(formula.f2, kb)) return true
            break
        case 'existquant':
            if (findAll(formula.where, [formula.variable], kb).length) return true
            break
        case 'if-else':
            return ask(formula.condition, kb) ? ask(formula.then, kb) : ask(formula.otherwise, kb)
        case 'math-expression':
            const left = (ask(formula.left, kb) as Number).value
            const right = (ask(formula.right, kb) as Number).value

            switch (formula.operator) {
                case '+': return $(left + right).$
                case '-': return $(left - right).$
                case '*': return $(left * right).$
                case '/': return $(left / right).$
                case '>': return left > right
                case '<': return left < right
            }

    }

    return kb.derivClauses.some(dc => {
        const map = match(dc.conseq, formula)

        if (!map) {
            return false
        }

        const whenn = substAll(dc.when, map)
        return ask(whenn, kb)
    })

}

