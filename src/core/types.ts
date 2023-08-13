import { DeepMap } from "../utils/DeepMap.ts"
import { deepEquals } from "../utils/deepEquals.ts"
import { first } from "../utils/first.ts"
import { isNotNullish } from "../utils/isNotNullish.ts"
import { uniq } from "../utils/uniq.ts"
import { valueIs } from "../utils/valueIs.ts"
import { ask } from "./ask.ts"
import { $ } from "./exp-builder.ts"
import { findAll } from "./findAll.ts"
import { match } from "./match.ts"
import { subst } from "./subst.ts"

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
    | List
export type Formula =
    | AtomicFormula
    | CompositeFormula
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
    | ImplicitReference
    | ArbitraryType
    | Complement
    | GeneralizedFormula
    | Cardinality
    | Which
export type DerivationClause =
    | WhenDerivationClause
    | AfterDerivationClause

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
    value: string,
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

export type Variable = {
    type: 'variable',
    /** name */ value: string,
    varType: string, // maybe make => Constant
}

export type List = {
    type: 'list',
    value: LLangAst[],
}

export type Complement = {
    type: 'complement',
    complementName: LLangAst,
    complement: LLangAst,
    phrase: LLangAst,
}

export type Cardinality = {
    type: 'cardinality',
    number: Constant,
    value: LLangAst,
}

export type Which = {
    type: 'which',
    which: LLangAst,
    inner: LLangAst,
}

export type ImplicitReference = {
    type: 'implicit-reference',
    headType: LLangAst,
}

export type ArbitraryType = {
    type: 'arbitrary-type',
    head: Variable,
    description: LLangAst,
    number: Constant,
}

export type MathExpression = {
    type: 'math-expression',
    operator: LLangAst,
    left: LLangAst,
    right: LLangAst,
}

export type GeneralizedFormula = {
    [key: string]: LLangAst,
} & {
    type: 'generalized',
}

export type IsAFormula = {
    type: 'is-a-formula',
    subject: LLangAst,
    object: LLangAst,
}

export type HasFormula = {
    type: 'has-formula',
    subject: LLangAst,
    object: LLangAst,
    as: LLangAst,
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
    value: LLangAst,
}

export type WhenDerivationClause = {
    type: 'when-derivation-clause',
    conseq: LLangAst,
    when: LLangAst,
}

export type AfterDerivationClause = {
    type: 'after-derivation-clause',
    conseq: LLangAst,
    after: LLangAst,
}

export type IfElse = {
    type: 'if-else',
    condition: LLangAst,
    then: LLangAst,
    otherwise: LLangAst,
}

export type AstMap = DeepMap<LLangAst, LLangAst>

export function isVar(t: LLangAst): t is Variable {
    return t.type === 'variable'
}

export function isConst(t: LLangAst): t is Constant {
    return t.type === 'entity'
        || t.type === 'number'
        || t.type === 'boolean'
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

    return isTerm(ast) || ast.type === 'list'

}

export function isWmAtom(x: unknown): x is WmAtom {
    return typeof x === 'string' || typeof x === 'boolean' || typeof x === 'number'
}

export function wmSentencesEqual(s1: IsASentence | HasSentence, s2: IsASentence | HasSentence) {
    return s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]
}

export function isLLangAst(x: unknown): x is LLangAst {

    if (x === null || typeof x !== 'object' || !('type' in x)) return false

    const astTypes: { [i in LLangAst['type']]: true } = {
        'boolean': true,
        'number': true,
        'entity': true,
        'command': true,
        'question': true,
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
        'cardinality': true,
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
    return uniq(wms.reduce((wm1, wm2) => wm1.concat(wm2), []))
}

export function conceptsOf(concept: WmAtom, kb: KnowledgeBase) {
    return findAll($(concept).isa('x:thing').$, [$('x:thing').$], kb).map(x => x.get($('x:thing').$)).filter(isNotNullish).map(x => x.value)
}

export function pointsToThings(ast: LLangAst): boolean {

    if (ast.type === 'conjunction' || ast.type === 'disjunction') {
        return pointsToThings(ast.f1) && pointsToThings(ast.f2)
    }

    return isAtom(ast)
        || ast.type === 'arbitrary-type'
        || ast.type === 'implicit-reference'
}

export function definitionOf(ast: LLangAst, kb: KnowledgeBase) {

    return first(kb.derivClauses, dc => {
        if (!('when' in dc)) return

        if (isConst(ast)) {
            if (astsEqual(dc.conseq, ast)) {
                return dc.when
            } else {
                return undefined
            }
        }

        const map = match(dc.conseq, ast, kb)
        if (!map) return

        const res = subst(dc.when, map)
        return res
    })
}

export function consequencesOf(ast: LLangAst, kb: KnowledgeBase): LLangAst[] {

    return kb.derivClauses.flatMap(dc => {
        if (!('after' in dc)) return []
        const map = match(definitionOf(dc.after, kb) ?? dc.after, definitionOf(ast, kb) ?? ast, kb)
        if (!map) return []
        const conseq = subst(dc.conseq, map)
        return [conseq]
    })

}

export function isWhenDerivationClause(ast: LLangAst): ast is WhenDerivationClause {
    return ast.type === 'when-derivation-clause'
}

export function askBin(ast: LLangAst, kb: KnowledgeBase): boolean {
    return isTruthy(ask(ast, kb).result)
}

export function isTruthy(ast: LLangAst) {
    return !astsEqual(ast, $(false).$) && !astsEqual(ast, $('nothing').$)
}

export function evalArgs<T extends LLangAst>(ast: T, kb0: KnowledgeBase): { rast: T, kb: KnowledgeBase }
export function evalArgs(ast: LLangAst, kb0: KnowledgeBase) {

    const res = Object.entries(ast).filter(valueIs(isLLangAst)).reduce((a, e) => {
        const r = ask(e[1], a.kb)
        return { rast: { ...a.rast, [e[0]]: r.result }, kb: r.kb }
    }, { rast: ast, kb: kb0 })

    return res
}

