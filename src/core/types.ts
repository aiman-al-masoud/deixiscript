import { DeepMap } from "../utils/DeepMap.ts"

/* WORLD-CONCEPTUAL MODEL */

export type WmAtom = string | number | boolean
export type IsASentence = [WmAtom, WmAtom]
export type HasSentence = [WmAtom, WmAtom, WmAtom]
export type WorldModel = (IsASentence | HasSentence)[]

export type KnowledgeBase = {
    wm: WorldModel,
    derivClauses: DerivationClause[],
    deicticDict: { [id: string]: number },
}

/* LANGUAGE */

export type LLangAst = Atom | Formula | Command | Question
export type Atom =
    | Term
    | ListPattern
    | ListLiteral
export type Formula =
    | SimpleFormula
    | CompositeFormula
    | Anaphor
export type Term =
    | Constant
    | Variable
export type Constant =
    | Entity
    | Boolean
    | Number
    | StringLiteral
export type SimpleFormula =
    | AtomicFormula
    | Equality
    | GeneralizedFormula
    | HappenSentence
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
    | MathExpression

export type Command = {
    type: 'command',
    f1: LLangAst,
}

export type Question = {
    type: 'question',
    f1: LLangAst,
}

export type Entity = {
    type: 'entity',
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

export type StringLiteral = {
    type: 'string',
    value: string
}

export type Variable = {
    type: 'variable',
    /** name */ value: string,
    varType: string,
}

export type ListLiteral = {
    type: 'list-literal',
    value: Atom[]
}

export type ListPattern = {
    type: 'list-pattern',
    seq: Atom,
    /** tail */ value: Atom,
}

export type Anaphor = {
    type: 'anaphor',
    head: Variable,
    description: LLangAst,
}

export type MathExpression = {
    type: 'math-expression',
    operator: '+' | '-' | '*' | '/' | '>' | '<',
    left: Atom | MathExpression,
    right: Atom | MathExpression,
}

export type GeneralizedFormula = {
    type: 'generalized',
    keys: {
        [key: string]: LLangAst
    },
    after: Atom,
}

export type HappenSentence = {
    type: 'happen-sentence',
    event: Constant,
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
    f1: LLangAst,
    f2: LLangAst,
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
    conseq: AtomicFormula | GeneralizedFormula,
    when: LLangAst,
}

export type IfElse = {
    type: 'if-else',
    condition: LLangAst,
    then: Formula,
    otherwise: LLangAst,
}

export function isVar(t: LLangAst): t is Variable {
    return t.type === 'variable'
}

export function isConst(t: LLangAst): t is Constant {
    return t.type === 'entity'
        || t.type === 'number'
        || t.type === 'boolean'
        || t.type === 'string'
}

export function isTerm(a: LLangAst): a is Term {
    return isVar(a) || isConst(a)
}

export function atomsEqual(a1: Atom, a2: Atom): boolean {

    if (a1.type === 'list-pattern' && a2.type === 'list-pattern') {
        return atomsEqual(a1.seq, a2.seq) && atomsEqual(a1.value, a2.value)
    }

    if (a1.type === 'list-literal' && a2.type === 'list-literal') {
        if (a1.value.length === a2.value.length && a1.value.map((x, i) => atomsEqual(a2.value[i], x))) return true
    }

    if (isVar(a1) && isVar(a2)) {
        return a1.value === a2.value && a1.varType === a2.varType
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

    return isTerm(ast)
        || ast.type === 'list-pattern'
        || ast.type === 'list-literal'
        || ast.type === 'anaphor'
        || ast.type === 'math-expression'

}

export function isAtomicFormula(ast: LLangAst): ast is AtomicFormula {
    return ast.type === 'is-a-formula' || ast.type === 'has-formula'
}

export function isFormulaWithAfter(ast: LLangAst): ast is AtomicFormula | GeneralizedFormula {
    return isAtomicFormula(ast) || ast.type === 'generalized'
}

export function isFormulaWithNonNullAfter(ast: LLangAst): ast is AtomicFormula | GeneralizedFormula {
    return isFormulaWithAfter(ast)
        && (ast.after.type !== 'list-literal' || !!ast.after.value.length)
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
