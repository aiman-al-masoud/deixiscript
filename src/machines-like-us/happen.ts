import { Atom, Formula, HasSentence, IsASentence, isConst, isVar, KnowledgeBase, LLangAst, WorldModel } from './types.ts'
import { $ } from './exp-builder.ts'
import { kb } from './logic.test.ts'
import { findAll } from './findAll.ts'
import { substAll } from './subst.ts'
import { dumpWorldModel } from './dumpWorldModel.ts'

/**
 * Recomputes a world model with the changes brought forward by an event.
 * 
 * Better performance than the naive query:
 * 
 *  const f1 = $('x:thing').has('y:thing').as('z:thing')
 *  const query = f1.isNotTheCase.and(f1.after(['my-event#1']))
 * 
 * Because it tends to reduce the number of free variables in the query,
 * therefore making findAll() less expensive. The cost of findAll() is 
 * proportional to the cost of a cartesian product between x sets, which 
 * is O(n^x), where 1<=x<=3 (world model formulas have 3 terms at most), 
 * bringing it down to even just x=2 is a significant improvement.
 * 
 * Also because it tends to specify the types of the variables involved,
 * therefore filtering out the irrelevant ones, reducing the size of the sets, 
 * and therefore reducing the constant factor.
 *
 *
 */
export function happen(event: string, kb: KnowledgeBase): WorldModel {

    return kb.derivClauses.flatMap(dc => {

        const x = {
            ...dc.conseq,
            after: { type: 'list-literal', list: [$(event).$] }
        } as Formula

        const variables = getTerms(x).filter(isVar)
        const results = findAll(x, variables, kb)
        const sub = substAll(x, results[0])
        return dumpWorldModel(sub, kb)
    })

}

console.log(happen('door-opening-event#1', kb))
// console.log(happen('door-closing-event#1', kb))

export function getTerms(ast: LLangAst): Atom[] {
    switch (ast.type) {
        case 'if-else':
            return getTerms(ast.condition).concat(getTerms(ast.otherwise)).concat(getTerms(ast.then))
        case 'derived-prop':
            return getTerms(ast.conseq).concat(getTerms(ast.when))
        case 'disjunction':
        case 'conjunction':
            return getTerms(ast.f1).concat(getTerms(ast.f2))
        case 'negation':
            return getTerms(ast.f1)
        case 'has-formula':
            return getTerms(ast.t1).concat(getTerms(ast.t2)).concat(getTerms(ast.as)).concat(getTerms(ast.after))
        case 'is-a-formula':
            return getTerms(ast.t1).concat(getTerms(ast.t2)).concat(getTerms(ast.after))
        case 'equality':
            return getTerms(ast.t1).concat(getTerms(ast.t2))
        case 'existquant':
            return [ast.variable, ...getTerms(ast.where)]
        case 'list-literal':
            return ast.list.flatMap(x => getTerms(x))
        case 'list-pattern':
            return [ast.seq, ast.tail]
        case 'constant':
        case 'variable':
        case 'boolean':
            return [ast]
    }

    throw new Error('not implemented!')
}
