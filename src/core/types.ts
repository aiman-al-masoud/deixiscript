import { DeepMap } from "../utils/DeepMap.ts"
import { deepEquals } from "../utils/deepEquals.ts"
// import { isNotNullish } from "../utils/isNotNullish.ts"
import { uniq } from "../utils/uniq.ts"
import { evaluate } from "./evaluate.ts";
import { $ } from "./exp-builder.ts"
// import { findAll } from "./findAll.ts"

/* WORLD-CONCEPTUAL MODEL */

export type WmAtom = string | number | boolean
export type IsASentence = readonly [WmAtom, WmAtom]
export type HasSentence = readonly [WmAtom, WmAtom, WmAtom]
export type WorldModel = readonly (IsASentence | HasSentence)[]

export type KnowledgeBase = {
    readonly wm: WorldModel,
    readonly derivClauses: DerivationClause[],
    readonly deicticDict: { readonly [hashId: string]: number },
}

/* LANGUAGE */

export type LLangAst = BasicLLangAst | NaturalisticLLangAst
export type BasicLLangAst =
    | Atom
    | CompositeFormula
    | AtomicFormula
    | Command
export type Atom =
    | Term
    | List
export type Term =
    | Constant
    | Variable
export type Constant =
    | Entity
    | Boolean
    | Number
    | Nothing
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
    | ArbitraryType
export type DerivationClause =
    | WhenDerivationClause
    | AfterDerivationClause
export type NaturalisticLLangAst =
    | ImplicitReference
    | Complement
    | Which
    | GeneralizedFormula


export type Command = {
    readonly type: 'command',
    readonly f1: LLangAst,
}

export type Entity = {
    readonly type: 'entity',
    readonly value: string,
}

export type Nothing = {
    readonly type: 'nothing',
    readonly value: '~',
}

export type Boolean = {
    readonly type: 'boolean',
    readonly value: boolean,
}

export type Number = {
    readonly type: 'number',
    readonly value: number,
}

export type Variable = {
    readonly type: 'variable',
    readonly value: string,
    readonly varType: string, // maybe make => Constant
}

export type List = {
    readonly type: 'list',
    readonly value: LLangAst[],
}

export type Complement = {
    readonly type: 'complement',
    readonly complementName: LLangAst,
    readonly complement: LLangAst,
    readonly phrase: LLangAst,
}

export type Which = {
    readonly type: 'which',
    readonly which: LLangAst,
    readonly inner: LLangAst,
}

export type ImplicitReference = {
    readonly type: 'implicit-reference',
    readonly headType: LLangAst,
    readonly number: LLangAst,
}

export type ArbitraryType = {
    readonly type: 'arbitrary-type',
    readonly head: LLangAst,
    readonly description: LLangAst,
    readonly number: LLangAst,
}

export type MathExpression = {
    readonly type: 'math-expression',
    readonly operator: LLangAst,
    readonly left: LLangAst,
    readonly right: LLangAst,
}

export type GeneralizedFormula = {
    readonly [key: string]: LLangAst,
} & {
    readonly type: 'generalized',
}

export type IsAFormula = {
    readonly type: 'is-a-formula',
    readonly subject: LLangAst,
    readonly object: LLangAst,
}

export type HasFormula = {
    readonly type: 'has-formula',
    readonly subject: LLangAst,
    readonly object: LLangAst,
    readonly as: LLangAst,
}

export type Conjunction = {
    readonly type: 'conjunction',
    readonly f1: LLangAst,
    readonly f2: LLangAst,
}

export type Disjunction = {
    readonly type: 'disjunction',
    readonly f1: LLangAst,
    readonly f2: LLangAst,
}

export type Negation = {
    readonly type: 'negation',
    readonly f1: LLangAst,
}

export type ExistentialQuantification = {
    readonly type: 'existquant',
    readonly value: LLangAst,
}

export type WhenDerivationClause = {
    readonly type: 'when-derivation-clause',
    readonly conseq: LLangAst,
    readonly when: LLangAst,
}

export type AfterDerivationClause = {
    readonly type: 'after-derivation-clause',
    readonly conseq: LLangAst,
    readonly after: LLangAst,
}

export type IfElse = {
    readonly type: 'if-else',
    readonly condition: LLangAst,
    readonly then: LLangAst,
    readonly otherwise: LLangAst,
}

export type AstMap = DeepMap<LLangAst, LLangAst>

export function isConst(t: LLangAst): t is Constant {
    return t.type === 'entity'
        || t.type === 'number'
        || t.type === 'boolean'
        || t.type === 'nothing' // slower
}

export function isTerm(a: LLangAst): a is Term {
    return isConst(a) || a.type === 'variable'
}

export function isHasSentence(s: IsASentence | HasSentence): s is HasSentence {
    return s.length === 3
}

export function isIsASentence(s: IsASentence | HasSentence): s is IsASentence {
    return s.length === 2
}

export function isAtom(ast: LLangAst): ast is Atom {
    return isTerm(ast) || ast.type === 'list'
}

export function isWmAtom(x: unknown): x is WmAtom {
    return typeof x === 'string' || typeof x === 'boolean' || typeof x === 'number'
}

export function wmSentencesEqual(s1: IsASentence | HasSentence, s2: IsASentence | HasSentence) {
    return s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]
}

export function isBasic(x: LLangAst): x is BasicLLangAst {
    return isAtom(x) || x.type === 'command' || x.type === 'is-a-formula' || x.type === 'has-formula'
        || x.type === 'conjunction' || x.type === 'disjunction' || x.type === 'negation' || x.type === 'existquant' || isWhenDerivationClause(x) || isAfterDerivationClause(x) || x.type === 'if-else' || x.type === 'math-expression' || x.type === 'arbitrary-type'
}

export function isLLangAst(x: unknown): x is LLangAst {

    if (x === null || typeof x !== 'object' || !('type' in x)) return false

    const astTypes: { [i in LLangAst['type']]: true } = {
        'boolean': true,
        'number': true,
        'entity': true,
        'command': true,
        'nothing': true,
        'variable': true,
        'list': true,
        'implicit-reference': true,
        'negation': true,
        'arbitrary-type': true,
        'is-a-formula': true,
        'disjunction': true,
        'if-else': true,
        'math-expression': true,
        'when-derivation-clause': true,
        'after-derivation-clause': true,
        'generalized': true,
        'has-formula': true,
        'existquant': true,
        'conjunction': true,
        'complement': true,
        'which': true,
    }

    return astTypes[x.type as LLangAst['type']]

}

export function astsEqual(astOne: LLangAst, astTwo: LLangAst) {
    return astOne.type === astTwo.type && deepEquals(astOne, astTwo)
}

export function subtractWorldModels(wm1: WorldModel, wm2: WorldModel): WorldModel {
    return wm1.filter(s1 => !wm2.some(s2 => wmSentencesEqual(s1, s2)))
}

export function addWorldModels(...wms: WorldModel[]): WorldModel {
    return uniq(wms.reduce((wm1, wm2) => [...wm1, ...wm2], []))
}

export function conceptsOf(concept: WmAtom, kb: KnowledgeBase) {
    const xs = conjToList(evaluate($('x:thing').suchThat($(concept).isa('x:thing'), Infinity).$, kb).result).filter(x => x.type !== 'nothing').filter(isConst).map(x => x.value)
    return xs
}

export function conjToList(x: LLangAst): LLangAst[] {
    if (x.type === 'conjunction') return [...conjToList(x.f2), ...conjToList(x.f1)] // reverse: oldest first
    return [x]
}

export function pointsToThings(ast: LLangAst): boolean {

    if (ast.type === 'conjunction' || ast.type === 'disjunction') {
        return pointsToThings(ast.f1) && pointsToThings(ast.f2)
    }

    if (ast.type === 'complement') {
        return pointsToThings(ast.phrase)
    }

    if (ast.type === 'math-expression') {
        return ast.operator.type === 'entity' && ['+', '-', '*', '/'].includes(ast.operator.value)
    }

    return isAtom(ast)
        || ast.type === 'arbitrary-type'
        || ast.type === 'implicit-reference'
        || ast.type === 'which'
}

export function isWhenDerivationClause(ast: LLangAst): ast is WhenDerivationClause {
    return ast.type === 'when-derivation-clause'
}

export function isAfterDerivationClause(ast: LLangAst): ast is AfterDerivationClause {
    return ast.type === 'after-derivation-clause'
}

export function isTruthy(ast: LLangAst) {
    return !astsEqual(ast, $(false).$) && !astsEqual(ast, $('nothing').$)
}
