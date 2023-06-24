import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { getAtoms } from "./getAtoms.ts";
import { instantiateConcept } from "./instantiateConcept.ts";
import { match } from "./match.ts";
import { substAll } from "./subst.ts";
import { test } from "./test.ts";
import { Atom, AtomicFormula, GeneralizedSimpleFormula, HasSentence, IsASentence, KnowledgeBase, LLangAst, WmAtom, WorldModel, isConst, isFormulaWithNonNullAfter, isHasSentence, isVar, wmSentencesEqual } from "./types.ts";
import { getConceptsOf } from "./wm-funcs.ts";

/**
 * Assume 'ast' is true, and recompute a knowledge base.
 */
export function recomputeKb(ast: LLangAst, kb: KnowledgeBase): KnowledgeBase {

    switch (ast.type) {

        case 'happen-sentence':
            const additions = getAdditions(ast.event.value, kb)
            return recomputeKbAfterAdditions(additions, kb)
        case 'has-formula':

            const t1 = test(ast.t1, kb) as Atom
            const t2 = test(ast.t2, kb) as Atom
            const as = test(ast.as, kb) as Atom

            if (!(isConst(t1) && isConst(t2) && isConst(as))) throw new Error('cannot serialize formula with variables!')

            const h: HasSentence = [t1.value, t2.value, as.value]
            return recomputeKbAfterAdditions([h], kb)
        // return {
        //     wm : kb.wm.concat([h]),
        //     derivClauses : kb.derivClauses,
        // }
        case 'is-a-formula':

            const t11 = test(ast.t1, kb) as Atom
            const t21 = test(ast.t2, kb) as Atom

            if (!(isConst(t11) && isConst(t21))) throw new Error('cannot serialize formula with variables!')
            const i: IsASentence = [t11.value, t21.value]
            return {
                wm: [...kb.wm, i],
                derivClauses: kb.derivClauses,
                deicticDict: kb.deicticDict,
            }
        case 'conjunction':
            const kb1 = recomputeKb(ast.f1, kb)
            const kb2 = recomputeKb(ast.f2, kb)
            return {
                wm: kb1.wm.concat(kb2.wm),
                derivClauses: kb1.derivClauses.concat(kb2.derivClauses),
                deicticDict: kb.deicticDict,
            }
        case 'derived-prop':
            return {
                ...kb,
                derivClauses: [...kb.derivClauses, ast],
            }
        case 'if-else':
            return test(ast.condition, kb) ? recomputeKb(ast.then, kb) : recomputeKb(ast.otherwise, kb)
        case 'existquant':
            return instantiateConcept(ast, kb) // TODO: recompute after additions

    }

    for (const dc of kb.derivClauses) {

        const map = match(dc.conseq, ast)

        if (map) {
            const whenn = substAll(dc.when, map)
            return recomputeKb(whenn, kb)
        }
    }

    throw new Error('not implemented!')

}



export function recomputeKbAfterAdditions(additions: WorldModel, kb: KnowledgeBase) {
    const eliminations = additions.filter(isHasSentence).flatMap(s => getExcludedBy(s, kb))
    const filtered = kb.wm.filter(s1 => !eliminations.some(s2 => wmSentencesEqual(s1, s2)))
    const final = filtered.concat(additions)

    const result: KnowledgeBase = {
        derivClauses: kb.derivClauses,
        wm: final,
        deicticDict: kb.deicticDict,
    }

    return result
}

/**
 * Computes the changes immediately caused by an event.
 * 
 * Better performance than the naive query:
 * 
 *  const f1 = $('x:thing').has('y:thing').as('z:thing')
 *  const query = f1.isNotTheCase.and(f1.after(['my-event#1']))
 * 
 * Because it tends to reduce the number of free variables in the query,
 * therefore making findAll() less expensive. The cost of findAll() is 
 * proportional to the cost of a cartesian product between x sets, which 
 * is O(n^x), where 1<=x<=3 (world model formulas have 3 terms at most, but this doesn't count custom formulas), 
 * bringing it down to even just x=2 is a significant improvement.
 * 
 * Also because it tends to specify the types of the variables involved,
 * therefore filtering out the irrelevant ones, reducing the size of the sets, 
 * and therefore reducing the constant factor.
 *
 *
 */
export function getAdditions(event: WmAtom, kb: KnowledgeBase): WorldModel {

    const changes = kb.derivClauses.flatMap(dc => {

        if (isFormulaWithNonNullAfter(dc.conseq)) {

            const x: AtomicFormula | GeneralizedSimpleFormula = {
                ...dc.conseq,
                after: { type: 'list-literal', list: [$(event).$] }
            }

            const variables = getAtoms(x).filter(isVar)
            const results = findAll(x, variables, kb, false)

            const eventConsequences = results.map(r => substAll(x, r))
                .flatMap(x => recomputeKb(x, kb).wm)

            const additions =
                eventConsequences.filter(s1 => !kb.wm.some(s2 => wmSentencesEqual(s1, s2)))

            return additions
        }

        return []
    })

    return changes

}

export function getExcludedBy(h: HasSentence, kb: KnowledgeBase) {
    const concepts = getConceptsOf(h[0], kb.wm)

    const qs =
        concepts.map(c => $({ ann: 'x:mutex-annotation', property: h[1], excludes: 'y:thing', onPart: h[2], onConcept: c }))

    const r =
        qs.flatMap(q => findAll(q.$, [$('x:mutex-annotation').$, $('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(x => x?.value !== h[1]).map(x => x?.value), false)


    //TODO: refactor-----
    const qs2 =
        concepts.map(c => $({ ann: 'x:only-one-annotation', onlyHaveOneOf: h[2], onConcept: c }))

    const r2 =
        qs2.flatMap(q => findAll(q.$, [$('x:only-one-annotation').$], kb))

    if (r2.length) {
        const buf = findAll($(h[0]).has('y:thing').as(h[2]).$, [$('y:thing').$], kb)
        r.push(...buf.map(x => x.get($('y:thing').$)?.value))
    }
    //---------

    const results = r.map(x => [h[0], x, h[2]] as HasSentence)
    return results

}
