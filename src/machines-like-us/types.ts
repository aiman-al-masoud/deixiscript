/* WORLD-CONCEPTUAL MODEL */

import { DeepMap } from "../utils/DeepMap.ts"

export type IsASentence = [string, string]
export type HasSentence = [string, string, string]
export type WorldModel = (IsASentence | HasSentence)[]

export type KnowledgeBase = {
    wm: WorldModel,
    derivClauses: DerivationClause[],
}

/* LANGUAGE */

export type LLangAst = Atom | Formula
export type Atom = Term | ListPattern | ListLiteral
export type Term = Constant | Variable | Boolean

export type ListLiteral = {
    type: 'list-literal',
    list: Atom[]
}

export type ListPattern = {
    type: 'list-pattern',
    seq: Atom,
    tail: Atom,
}

export type Constant = {
    type: 'constant',
    value: string
}

export type Variable = {
    type: 'variable',
    name: string,
    varType: string
}

export type Boolean = {
    type: 'boolean',
    value: boolean,
}

export type Formula = SimpleFormula | CompositeFormula
export type SimpleFormula = AtomicFormula | Equality
export type AtomicFormula = IsAFormula | HasFormula

export type VarMap = DeepMap<Variable | ListPattern, Atom>

export type CompositeFormula =
    Conjunction
    | Disjunction
    | Negation
    | ExistentialQuantification
    | DerivationClause
    | IfElse

export type Equality = {
    type: 'equality',
    t1: Atom,
    t2: Atom,
}

export type IsAFormula = {
    type: 'is-a-formula',
    t1: Atom,
    t2: Atom,
    after: Atom,
}

export type HasFormula = {
    type: 'has-formula',
    t1: Atom,
    t2: Atom,
    as: Atom,
    after: Atom,
}

export type Conjunction = {
    type: 'conjunction',
    f1: Formula,
    f2: Formula,
}

export type Disjunction = {
    type: 'disjunction',
    f1: Formula,
    f2: Formula,
}

export type Negation = {
    type: 'negation',
    f1: Formula,
}

export type ExistentialQuantification = {
    type: 'existquant',
    variable: Variable,
    where: LLangAst,
}

export type DerivationClause = {
    type: 'derived-prop',
    conseq: AtomicFormula,
    when: LLangAst,
}

export type IfElse = {
    type: 'if-else',
    condition: Formula,
    then: Formula,
    otherwise: LLangAst,
}

export function isVar(t: Atom): t is Variable {
    return t.type === 'variable'
}

export function isVarish(a: Atom): a is Variable | ListPattern {
    return a.type === 'variable' || a.type === 'list-pattern'
}

export function isConst(t: Atom): t is Constant {
    return t.type === 'constant'
}

export function isTerm(a: Atom): a is Term {
    return isVar(a) || isConst(a)
}

export function isListLiteral(a: Atom): a is ListLiteral {
    return a.type === 'list-literal'
}

export function atomsEqual(a1: Atom, a2: Atom): boolean {

    if (a1.type === 'list-pattern' && a2.type === 'list-pattern') {
        return atomsEqual(a1.seq, a2.seq) && atomsEqual(a1.tail, a2.tail)
    }

    if (isVar(a1) && isVar(a2)) {
        return a1.name === a2.name && a1.varType === a2.varType
    }

    if (isConst(a1) && isConst(a2)) {
        return a1.value === a2.value
    }

    return false

}

export function isHasSentence(s: IsASentence | HasSentence): s is HasSentence {
    return s.length === 3
}

export function isAtom(ast: LLangAst): ast is Atom {
    return ast.type === 'variable'
        || ast.type === 'constant'
        || ast.type === 'list-literal'
        || ast.type === 'list-pattern'
}

export function isAtomicFormula(ast: LLangAst): ast is AtomicFormula {
    return ast.type === 'is-a-formula' || ast.type === 'has-formula'
}

export function isAtomTruthy(atom: Atom) {
    if (atom.type === 'boolean') {
        return atom.value === true
    } else if (isTerm(atom)) {
        return !!atom
    } else if (atom.type === 'list-literal') {
        return !!atom.list.length
    } else {
        return !!atom
    }
}

export function formulasEqual(f1: LLangAst, f2: LLangAst): boolean {

    if (f1.type === 'list-literal' && f2.type === 'list-pattern') {
        return f1.list.length >= 2
    } else if (f2.type === 'list-literal' && f1.type === 'list-pattern') {
        return f2.list.length >= 2
    } else if (f1.type === 'conjunction' && f2.type === 'conjunction') {
        return formulasEqual(f1.f1, f2.f1) && formulasEqual(f1.f2, f2.f2)
    } else if (f1.type === 'disjunction' && f2.type === 'disjunction') {
        return formulasEqual(f1.f1, f2.f1) && formulasEqual(f1.f2, f2.f2)
    } else if (f1.type === 'negation' && f2.type === 'negation') {
        return formulasEqual(f1.f1, f2.f1)
    } else if (f1.type === 'equality' && f2.type === 'equality') {
        return formulasEqual(f1.t1, f2.t1) && formulasEqual(f1.t2, f2.t2)
    } else if (f1.type === 'is-a-formula' && f2.type === 'is-a-formula') {
        return formulasEqual(f1.t1, f2.t1) && formulasEqual(f1.t2, f2.t2) && formulasEqual(f1.after, f2.after)
    } else if (f1.type === 'if-else' && f2.type === 'if-else') {
        return formulasEqual(f1.condition, f2.condition) && formulasEqual(f1.otherwise, f2.otherwise) && formulasEqual(f1.then, f2.then)
    } else if (f1.type === 'existquant' && f2.type === 'existquant') {
        return formulasEqual(f1.variable, f2.variable) && formulasEqual(f1.where, f2.where)
    } else if (f1.type === 'has-formula' && f2.type === 'has-formula') {
        return formulasEqual(f1.t1, f2.t2) && formulasEqual(f1.t2, f2.t2) && formulasEqual(f1.as, f1.as) && formulasEqual(f1.after, f2.after)
    } else if (f1.type === 'derived-prop' && f2.type === 'derived-prop') {
        return formulasEqual(f1.conseq, f2.conseq) && formulasEqual(f1.when, f2.when)
    } else if (f1.type === 'list-pattern' && f2.type === 'list-pattern') {
        return formulasEqual(f1.seq, f2.seq) && formulasEqual(f1.tail, f2.tail)
    } else if (f1.type === 'list-literal' && f2.type === 'list-literal') {
        return f1.list.length === f2.list.length && f1.list.every((x, i) => formulasEqual(x, f2.list[i]))
    } else if (f1.type === 'boolean' && f2.type === 'boolean') {
        return f1.value === f2.value
    } else if (f1.type === 'variable' && f2.type === 'variable') {
        return f1.name === f2.name && f1.varType === f2.varType
    } else if (f1.type === 'constant' && f2.type === 'constant') {
        return f1.value === f2.value
    }

    return false
    // throw new Error('not implemented!' + f1.type+' '+ f2.type)
    // return JSON.stringify(f1) === JSON.stringify(f2)
}