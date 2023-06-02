import { Atom, AtomicFormula, Formula, isAtom, isAtomicFormula, isVar, KnowledgeBase, LLangAst, Term, WorldModel } from './types.ts'
import { $ } from './exp-builder.ts'
import { kb } from './logic.test.ts'
import { findAll } from './findAll.ts'
import { test } from './test.ts'
import { subst, substAll } from './subst.ts'

export function happen(event: string, kb: KnowledgeBase): WorldModel {
    kb.derivClauses.map(dc => {

        const x = {
            ...dc.conseq,
            after: { type: 'list-literal', list: [$(event).$] }
        } as Formula

        const vs = getTerms(x).filter(isVar)
        // console.log(vs)
        // console.log(x)

        console.log(findAll(x, vs, kb))
        console.log(x)
    })

    return []
}

happen('door-opening-event#1', kb)

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
