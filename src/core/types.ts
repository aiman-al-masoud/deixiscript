import { DeepMap } from "../utils/DeepMap.ts"
import { deepEquals } from "../utils/deepEquals.ts"

/* WORLD-CONCEPTUAL MODEL */

export type WmAtom = string | number | boolean
export type IsASentence = [WmAtom, WmAtom]
export type HasSentence = [WmAtom, WmAtom, WmAtom]
export type WorldModel = (IsASentence | HasSentence)[]

export type KnowledgeBase = {
    readonly wm: WorldModel,
    readonly derivClauses: DerivationClause[],
    readonly deicticDict: { readonly [id: string]: number },
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
export type Term =
    | Constant
    | Variable
export type Constant =
    | Entity
    | Boolean
    | Number
    | StringLiteral
    | Anything
    | Nothing
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
    | Anaphor
    | ArbitraryType

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

export type Anything = {
    type: 'anything',
    value: '*',
}

export type Nothing = {
    type: 'nothing',
    value: '~',
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

export type Anaphor = { // implicit reference
    type: 'anaphor',
    headType: string,
    which?: SimpleFormula, // happen-sentence??
    whose?: SimpleFormula, // happen-sentence??
    number: 1 | '*',
}

export type MathExpression = {
    type: 'math-expression',
    operator: '+' | '-' | '*' | '/' | '>' | '<' | '<=' | '>=',
    left: Atom,
    right: Atom | MathExpression,
}

export type GeneralizedFormula = {
    [key: string]: LLangAst,
} & {
    type: 'generalized',
    after: LLangAst,
}

export type HappenSentence = {
    type: 'happen-sentence',
    subject: Atom,
}

export type AstMap = DeepMap<LLangAst, LLangAst>

export type Equality = {
    type: 'equality',
    subject: LLangAst,
    object: LLangAst,
}

export type IsAFormula = {
    type: 'is-a-formula',
    subject: LLangAst,
    object: LLangAst,
    after: LLangAst,
}

export type HasFormula = {
    type: 'has-formula',
    subject: LLangAst,
    object: LLangAst,
    as: LLangAst,
    after: LLangAst,
}

export type Conjunction = {
    type: 'conjunction',
    f1: LLangAst,
    f2: LLangAst,
}

export type Disjunction = {
    type: 'disjunction',
    f1: LLangAst,
    f2: LLangAst,
}

export type Negation = {
    type: 'negation',
    f1: LLangAst,
}

export type ExistentialQuantification = {
    type: 'existquant',
    value: Anaphor | ArbitraryType,
}

export type ArbitraryType = {
    type: 'arbitrary-type',
    head: Variable,
    description: LLangAst,
}

export type DerivationClause = {
    type: 'derivation-clause',
    conseq: AtomicFormula | GeneralizedFormula,
    when: LLangAst,
}

export type IfElse = {
    type: 'if-else',
    condition: LLangAst,
    then: LLangAst,
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

        || t.type === 'anything' //TODO!!!!!!! to serialize or not to serialize (tell())? You (at the very least) need to remove anything from WM when new info comes! 
}

export function isTerm(a: LLangAst): a is Term {
    return isVar(a) || isConst(a)
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

export function isWmAtom(x: unknown): x is WmAtom {
    return typeof x === 'string' || typeof x === 'boolean' || typeof x === 'number'
}

export function wmSentencesEqual(s1: IsASentence | HasSentence, s2: IsASentence | HasSentence) {
    return s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]
}

export function isLLangAst(x: unknown): x is LLangAst {
    return x !== null && typeof x === 'object' && 'type' in x //TODO: also check type
}

export function isSimpleFormula(ast: LLangAst): ast is SimpleFormula {
    return ast.type === 'equality'
        || ast.type === 'is-a-formula'
        || ast.type === 'has-formula'
        || ast.type === 'generalized'
        || ast.type === 'happen-sentence'

}

export function astsEqual(astOne: LLangAst, astTwo: LLangAst) {
    return astOne.type === astTwo.type && deepEquals(astOne, astTwo)
}