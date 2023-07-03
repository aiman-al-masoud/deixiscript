import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { getAtoms } from "./getAtoms.ts";
import { instantiateConcept } from "./instantiateConcept.ts";
import { match } from "./match.ts";
import { substAll } from "./subst.ts";
import { ask } from "./ask.ts";
import { Atom, AtomicFormula, GeneralizedSimpleFormula, HasSentence, KnowledgeBase, LLangAst, WmAtom, WorldModel, isConst, isFormulaWithNonNullAfter, isHasSentence, isVar, wmSentencesEqual } from "./types.ts";
import { addWorldModels, getConceptsOf, subtractWorldModels } from "./wm-funcs.ts";

/**
 * Assume the AST is true, and compute resulting knowledge base.
 * Also provides WorldModel additions and elmininations (the "diff") 
 * to avoid having to recompute them.
 */
export function tell(ast: LLangAst, kb: KnowledgeBase): {
    kb: KnowledgeBase,
    additions: WorldModel,
    eliminations: WorldModel,
} {

    switch (ast.type) {

        case 'happen-sentence':
            {
                const additions = getAdditions(ast.event.value, kb)
                const eliminations = additions.filter(isHasSentence).flatMap(s => getExcludedBy(s, kb))
                const filtered = subtractWorldModels(kb.wm, eliminations)

                return {
                    kb: {
                        ...kb,
                        wm: addWorldModels(filtered, additions),
                    },
                    additions: additions,
                    eliminations: eliminations
                }
            }
        case 'has-formula':
            {
                const t1 = ask(ast.t1, kb) as Atom
                const t2 = ask(ast.t2, kb) as Atom
                const as = ask(ast.as, kb) as Atom
                if (!(isConst(t1) && isConst(t2) && isConst(as))) throw new Error('cannot serialize formula with variables!')

                const additions: WorldModel = [[t1.value, t2.value, as.value]]
                const eliminations = additions.filter(isHasSentence).flatMap(s => getExcludedBy(s, kb))
                const filtered = subtractWorldModels(kb.wm, eliminations)

                return {
                    kb: {
                        ...kb,
                        wm: addWorldModels(filtered, additions),
                    },
                    additions: additions,
                    eliminations: eliminations,
                }
            }
        case 'is-a-formula': //TODO: recompute after additions
            {
                const t11 = ask(ast.t1, kb) as Atom
                const t21 = ask(ast.t2, kb) as Atom

                if (!(isConst(t11) && isConst(t21))) throw new Error('cannot serialize formula with variables!')
                const additions: WorldModel = [[t11.value, t21.value]] //TODO this serializes entities and string the same way
                const eliminations: WorldModel = []

                return {
                    kb: {
                        ...kb,
                        wm: addWorldModels(kb.wm, additions),
                    },
                    additions: additions,
                    eliminations: eliminations,
                }
            }
        case 'conjunction':
            {
                const result1 = tell(ast.f1, kb)
                const result2 = tell(ast.f2, kb)
                return {
                    kb: {
                        wm: addWorldModels(result1.kb.wm, result2.kb.wm),
                        derivClauses: result1.kb.derivClauses.concat(result2.kb.derivClauses),
                        deicticDict: kb.deicticDict,
                    },
                    additions: addWorldModels(result1.additions, result2.additions),
                    eliminations: addWorldModels(result1.eliminations, result2.eliminations),
                }
            }
        case 'disjunction':
            return tell(ast.f1, kb)
        case 'derived-prop':
            return {
                kb: {
                    ...kb,
                    derivClauses: [...kb.derivClauses, ast],
                },
                additions: [],
                eliminations: [],
            }
        case 'if-else':
            return ask(ast.condition, kb) ? tell(ast.then, kb) : tell(ast.otherwise, kb)
        case 'existquant':
            {
                const additions: WorldModel = instantiateConcept(ast, kb)
                const eliminations: WorldModel = [] // TODO

                return {
                    kb: {
                        ...kb,
                        wm: addWorldModels(kb.wm, additions)
                    },
                    additions,
                    eliminations,
                }
            }
        case 'negation':
            {
                const { additions, eliminations } = tell(ast.f1, kb)
                const newWm = addWorldModels(subtractWorldModels(kb.wm, additions), eliminations)
                return {
                    kb: {
                        ...kb,
                        wm: newWm,
                    },
                    additions: eliminations,
                    eliminations: additions,
                }
            }
        case 'boolean':
            return {
                kb,
                additions: [],
                eliminations: [],
            }

    }

    for (const dc of kb.derivClauses) {

        const map = match(dc.conseq, ast)

        if (map) {
            const whenn = substAll(dc.when, map)
            return tell(whenn, kb)
        }
    }

    throw new Error('not implemented! ' + ast.type)

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
function getAdditions(event: WmAtom, kb: KnowledgeBase): WorldModel {

    const changes = kb.derivClauses.flatMap(dc => {

        if (isFormulaWithNonNullAfter(dc.conseq)) {

            const x: AtomicFormula | GeneralizedSimpleFormula = {
                ...dc.conseq,
                after: $([event]).$ //{ type: 'list-literal', list: [$(event).$] }
            }

            const variables = getAtoms(x).filter(isVar)
            const results = findAll(x, variables, kb, false)

            const eventConsequences = results.map(r => substAll(x, r))
                .flatMap(x => tell(x, kb).kb.wm)

            const additions =
                subtractWorldModels(eventConsequences, kb.wm)

            return additions
        }

        return []
    })

    return changes

}

function getExcludedBy(h: HasSentence, kb: KnowledgeBase) { //TODO: refactor & optmizie
    const concepts = getConceptsOf(h[0], kb.wm)

    const qs = concepts.map(c => $({ annotation: 'x:mutex-annotation', subject: h[1], verb: 'exclude', object: 'y:thing', location: h[2], owner: c }))

    const r =
        qs.flatMap(q => findAll(q.$, [$('x:mutex-annotation').$, $('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(x => x?.value !== h[1]).map(x => x?.value), false)

    //--------
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

