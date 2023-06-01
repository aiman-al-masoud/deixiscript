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
export type Term = Constant | Variable | Boolean | Number

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
export type SimpleFormula = AtomicFormula | Equality | GeneralizedSimpleFormula | GreaterThenFormula
export type AtomicFormula = IsAFormula | HasFormula

export type GeneralizedSimpleFormula = {
    type: 'generalized',
    keys: {
        [key: string]: Atom
    }
}

export type GreaterThenFormula = {
    type: 'greater-than',
    greater: Atom,
    lesser: Atom,
}

export type Number = {
    type: 'number',
    value: number,
}

export type VarMap = DeepMap<Variable, Atom>

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
    conseq: SimpleFormula,
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

export function isConst(t: Atom): t is Constant {
    return t.type === 'constant' || t.type === 'number' || t.type === 'boolean'
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

export function isTruthy(atom: Atom) {
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

export function isSimple(ast: LLangAst): ast is SimpleFormula {
    return isAtomicFormula(ast) || ast.type === 'equality' || ast.type === 'generalized'
}