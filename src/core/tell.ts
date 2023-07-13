import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { instantiateConcept } from "./instantiateConcept.ts";
import { match } from "./match.ts";
import { subst } from "./subst.ts";
import { ask } from "./ask.ts";
import { AtomicFormula, DerivationClause, GeneralizedFormula, HasSentence, IsASentence, KnowledgeBase, LLangAst, WmAtom, WorldModel, isConst, isFormulaWithNonNullAfter, isIsASentence } from "./types.ts";
import { addWorldModels, getConceptsOf, getParts, subtractWorldModels } from "./wm-funcs.ts";
import { decompress } from "./decompress.ts";
import { anaphorToArbitraryType, removeAnaphors } from "./removeAnaphors.ts";
import { findAst } from "./findAst.ts";


/**
 * Assume the AST is true, and compute resulting knowledge base.
 * Also provides WorldModel additions and elmininations (the "diff") 
 * to avoid having to recompute them.
 */
export function tell(ast1: LLangAst, kb: KnowledgeBase): {
    kb: KnowledgeBase,
    additions: WorldModel,
    eliminations: WorldModel,
} {

    const ast = decompress(ast1)

    let additions: WorldModel = []
    let eliminations: WorldModel = []
    let addedDerivationClauses: DerivationClause[] = []

    switch (ast.type) {

        case 'happen-sentence':
            additions = consequencesOf(ast.event.value, kb)
            break
        case 'has-formula':
            const t1 = ask(ast.t1, kb).result
            const t2 = ask(ast.t2, kb).result
            const as = ask(ast.as, kb).result
            if (!isConst(t1) || !isConst(t2) || !isConst(as)) throw new Error('cannot serialize formula with variables!')

            additions = [[t1.value, t2.value, as.value]]
            break
        case 'is-a-formula':

            const t11 = ask(ast.t1, kb).result
            const t21 = ask(ast.t2, kb).result

            if (!isConst(t11) || !isConst(t21)) throw new Error('cannot serialize formula with variables!')

            additions = addWorldModels(
                [[t11.value, t21.value]], //TODO this serializes entities and string the same way
                getDefaultFillers(t11.value, t21.value, kb),
            )
            break
        case 'conjunction':
            const result1 = tell(ast.f1, kb)
            const result2 = tell(ast.f2, kb)
            additions = addWorldModels(result1.additions, result2.additions)
            addedDerivationClauses = result1.kb.derivClauses.concat(result2.kb.derivClauses)
            break
        case 'disjunction':
            // console.warn('serialized only first formula of disjunction')
            return tell(ast.f1, kb)
        case 'derived-prop':
            addedDerivationClauses = [removeAnaphors(ast, kb)]
            break
        case 'if-else':
            return ask(ast.condition, kb).result.value ? tell(ast.then, kb) : tell(ast.otherwise, kb)
        case 'existquant':

            const arbitraryType = ast.value.type === 'anaphor' ? anaphorToArbitraryType(ast.value) : ast.value
            additions = instantiateConcept(arbitraryType, kb) //TODO: eliminations
            break
        case 'negation':
            const result = tell(ast.f1, kb)
            additions = result.eliminations
            eliminations = result.additions
            break
        case 'generalized':
            for (const dc of kb.derivClauses) {

                const map = match(dc.conseq, ast)
                if (!map) continue

                const prec = subst(dc.preconditions, map)
                if (!ask(prec, kb).result.value) continue

                const whenn = subst(dc.when, map)
                return tell(whenn, kb)
            }
            break
        default:
            additions = []
            addedDerivationClauses = []
            break
    }

    eliminations = [
        ...eliminations,
        ...additions.flatMap(s => getExcludedBy(s, kb)), //slow
    ]

    const filtered = subtractWorldModels(kb.wm, eliminations)

    return {
        additions,
        eliminations,
        kb: {
            ...kb,
            wm: addWorldModels(filtered, additions),
            derivClauses: [...kb.derivClauses, ...addedDerivationClauses],
        }
    }

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
function consequencesOf(event: WmAtom, kb: KnowledgeBase): WorldModel {

    const changes = kb.derivClauses.flatMap(dc => {

        if (isFormulaWithNonNullAfter(dc.conseq)) {

            const x: AtomicFormula | GeneralizedFormula = {
                ...dc.conseq,
                after: $([event]).$
            } as GeneralizedFormula

            const variables = findAst(x, 'variable')
            const results = findAll(x, variables, kb, false)

            const eventConsequences = results.map(r => subst(x, r))
                .flatMap(x => tell(x, kb).kb.wm)

            const additions =
                subtractWorldModels(eventConsequences, kb.wm)

            return additions
        }

        return []
    })

    return changes

}

function getExcludedBy(h: HasSentence | IsASentence, kb: KnowledgeBase) { //TODO: refactor & optmizie

    if (isIsASentence(h)) {
        return getExcludedByMutexConcepts(h, kb)
    }

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

export function getExcludedByMutexConcepts(i: IsASentence, kb: KnowledgeBase): WorldModel {

    const concepts = getConceptsOf(i[0], kb.wm)
    const qs = concepts.map(c => $({ ann: 'x:mutex-concepts-annotation', concept: c, excludes: 'c2:thing' }))

    const r =
        qs.flatMap(q => findAll(q.$, [$('x:mutex-concepts-annotation').$, $('c2:thing').$], kb))
            .map(x => x.get($('c2:thing').$))
            .map(x => x?.value)
            .filter(x => x !== i[1])

    const result = r.map(x => [i[0], x] as IsASentence)

    return result
}


function getDefaultFillers(id: WmAtom, concept: WmAtom, kb: KnowledgeBase) {
    const parts = getParts(concept, kb.wm)
    const defaults = parts.map(p => findDefault(p, concept, kb))

    const fillers = defaults.flatMap((d, i) => {
        if (d === undefined) return []
        if (typeof d === 'number' || typeof d === 'boolean') return tell($(id).has(d).as(parts[i]).$, kb).additions

        return instantiateConcept({
            type: 'arbitrary-type',
            head: $(`x:${d}`).$,
            description: $(id).has(`x:${d}`).as(parts[i]).$
        }, kb)
    })

    return fillers
}

function findDefault(part: WmAtom, concept: WmAtom, kb: KnowledgeBase): WmAtom | undefined { //TODO: optimize
    const result = findAll(
        $({ annotation: 'x:thing', subject: part, owner: concept, verb: 'default', recipient: 'z:thing' }).$,
        [$('x:thing').$, $('z:thing').$],
        kb,
    )
    return result[0]?.get($('z:thing').$)?.value
}
