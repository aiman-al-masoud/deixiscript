/* WORLD-CONCEPTUAL MODEL */

import { DeepMap } from "../utils/DeepMap.ts"

export type WmAtom = string | number | boolean
export type IsASentence = [WmAtom, WmAtom]
export type HasSentence = [WmAtom, WmAtom, WmAtom]
export type WorldModel = (IsASentence | HasSentence)[]

export type KnowledgeBase = {
    wm: WorldModel,
    derivClauses: DerivationClause[],
}

/* LANGUAGE */

export type LLangAst = Atom | Formula
export type Atom =
    | Term
    | ListPattern
    | ListLiteral
    | Anaphor
    | MathExpression
export type Formula =
    | SimpleFormula
    | CompositeFormula
export type Term =
    | Constant
    | Variable
export type Constant =
    | Entity
    | Boolean
    | Number
export type SimpleFormula =
    | AtomicFormula
    | Equality
    | GeneralizedSimpleFormula
    | GreaterThanFormula
export type AtomicFormula =
    | IsAFormula
    | HasFormula
export type CompositeFormula =
    | Conjunction
    | Disjunction
    | Negation
    | ExistentialQuantification
    | DerivationClause
    | IfElse

export type Entity = {
    type: 'constant',
    value: string
}

export type Boolean = {
    type: 'boolean',
    value: boolean,
}

export type Number = {
    type: 'number',
    value: number,
}

export type Variable = {
    type: 'variable',
    name: string,
    varType: string
}

export type ListLiteral = {
    type: 'list-literal',
    list: Atom[]
}

export type ListPattern = {
    type: 'list-pattern',
    seq: Atom,
    tail: Atom,
}

export type Anaphor = {
    type: 'anaphor',
    head: Variable,
    description: LLangAst,
}

export type MathExpression = {
    type: 'math-expression',
    operator: '+' | '-' | '*' | '/',
    left: Atom | MathExpression,
    right: Atom | MathExpression,
}

export type GeneralizedSimpleFormula = {
    type: 'generalized',
    keys: {
        [key: string]: Atom
    },
    after: Atom,
}

export type GreaterThanFormula = {
    type: 'greater-than',
    greater: Atom,
    lesser: Atom,
}

export type VarMap = DeepMap<Variable, Atom>

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
    conseq: AtomicFormula | GeneralizedSimpleFormula,
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
    return t.type === 'constant'
        || t.type === 'number'
        || t.type === 'boolean'
}

export function isTerm(a: Atom): a is Term {
    return isVar(a) || isConst(a)
}

export function atomsEqual(a1: Atom, a2: Atom): boolean {

    if (a1.type === 'list-pattern' && a2.type === 'list-pattern') {
        return atomsEqual(a1.seq, a2.seq) && atomsEqual(a1.tail, a2.tail)
    }

    if (a1.type === 'list-literal' && a2.type === 'list-literal') {
        if (a1.list.length === a2.list.length && a1.list.map((x, i) => atomsEqual(a2.list[i], x))) return true
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

export function isIsASentence(s: IsASentence | HasSentence): s is IsASentence {
    return s.length === 2
}

export function isAtom(ast: LLangAst | WmAtom | WmAtom[]): ast is Atom {

    if (ast instanceof Array) return false
    if (isWmAtom(ast)) return false

    return ast.type === 'variable'
        || ast.type === 'constant'
        || ast.type === 'list-literal'
        || ast.type === 'list-pattern'
        || ast.type === 'boolean'
        || ast.type === 'number'
        || ast.type === 'anaphor'
        || ast.type === 'math-expression'
}

export function isAtomicFormula(ast: LLangAst): ast is AtomicFormula {
    return ast.type === 'is-a-formula' || ast.type === 'has-formula'
}

export function isFormulaWithAfter(ast: LLangAst): ast is AtomicFormula | GeneralizedSimpleFormula {
    return isAtomicFormula(ast) || ast.type === 'generalized'
}

export function isFormulaWithNonNullAfter(ast: LLangAst): ast is AtomicFormula | GeneralizedSimpleFormula {
    return isFormulaWithAfter(ast)
        && (ast.after.type !== 'list-literal' || !!ast.after.list.length)
}

export function isSimple(ast: LLangAst): ast is SimpleFormula {
    return isAtomicFormula(ast) || ast.type === 'equality' || ast.type === 'generalized'
}

export function isWmAtom(x: unknown): x is WmAtom {
    return typeof x === 'string' || typeof x === 'boolean' || typeof x === 'number'
}

export function wmSentencesEqual(s1: IsASentence | HasSentence, s2: IsASentence | HasSentence) {
    return s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]
}
