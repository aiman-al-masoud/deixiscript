import { Ast, Atom, AtomicFormula, Conjunction, Constant, DerivationClause, Disjunction, Equality, ExistentialQuantification, Formula, HasFormula, IfElse, IsAFormula, isAtom, isAtomicFormula, ListLiteral, ListPattern, Variable } from "./types.ts"

export function $(x: ListPat): ExpBuilder<ListPattern>
export function $(x: Var): ExpBuilder<Variable>
export function $(x: string[]): ExpBuilder<ListLiteral>
export function $(x: string): ExpBuilder<Constant>

export function $(x: string | string[]): ExpBuilder<Atom> {
    return new ExpBuilder(makeAtom(x))
}

class ExpBuilder<T extends Ast> {

    constructor(readonly exp: T) {

    }

    is(term: string): ExpBuilder<Equality> {

        if (!isAtom(this.exp)) {
            throw new Error(`expecting an atom, not a ${this.exp.type}, as subject of equality`)
        }

        return new ExpBuilder({
            type: 'equality',
            t1: this.exp,
            t2: makeAtom(term),
        })

    }

    isa(term: string): ExpBuilder<IsAFormula> {

        if (!isAtom(this.exp)) {
            throw new Error(`expecting an atom, not a ${this.exp.type}, as subject of IsASentence`)
        }

        return new ExpBuilder({
            type: 'is-a-formula',
            t1: this.exp,
            t2: makeAtom(term),
            after: { type: 'list-literal', list: [] }
        })

    }

    has(term: string): ExpBuilder<HasFormula> {

        if (!isAtom(this.exp)) {
            throw new Error(`expecting an atom, not a ${this.exp.type}, as subject of HasSentence`)
        }

        return new ExpBuilder({
            type: 'has-formula',
            t1: this.exp,
            t2: makeAtom(term),
            as: makeAtom(term),
            after: { type: 'list-literal', list: [] },
        })

    }

    as(role: string): ExpBuilder<HasFormula> {

        if (this.exp.type !== 'has-formula') {
            throw new Error(`'as' does not apply to ${this.exp.type}, only to HasFormula`)

        }

        return new ExpBuilder({
            type: 'has-formula',
            t1: this.exp.t1,
            t2: this.exp.t2,
            as: makeAtom(role),
            after: this.exp.after,
        })

    }

    after(atom: string | string[]): ExpBuilder<AtomicFormula> {

        if (!isAtomicFormula(this.exp)) {
            throw new Error(`'after' does not apply to ${this.exp.type}, only to AtomicFormula`)
        }

        return new ExpBuilder({
            ...this.exp,
            after: makeAtom(atom),
        })
    }

    when(formula: ExpBuilder<Formula>): ExpBuilder<DerivationClause> {

        if (!isAtomicFormula(this.exp)) {
            throw new Error(`the 'conseq' of a DerivationClause must be an AtomicFormula not a ${this.exp.type}`)
        }

        return new ExpBuilder({
            type: 'derived-prop',
            when: formula.$,
            conseq: this.exp,
        })

    }

    and(formula: ExpBuilder<Formula>): ExpBuilder<Conjunction> {

        if (isAtom(this.exp)) {
            throw new Error(``)
        }

        if (isAtom(formula.$)) {
            throw new Error(``)
        }

        return new ExpBuilder({
            type: 'conjunction',
            f1: this.exp as Formula,
            f2: formula.$,
        })

    }

    or(formula: ExpBuilder<Formula>): ExpBuilder<Disjunction> {

        if (isAtom(this.exp)) {
            throw new Error(``)
        }

        if (isAtom(formula.$)) {
            throw new Error(``)
        }

        return new ExpBuilder({
            type: 'disjunction',
            f1: this.exp as Formula,
            f2: formula.$,
        })

    }

    if(formula: ExpBuilder<Formula>): ExpBuilder<IfElse> {

        if (isAtom(this.exp)) {
            throw new Error(``)
        }

        if (isAtom(formula.$)) {
            throw new Error(``)
        }

        return new ExpBuilder({
            type: 'if-else',
            condition: formula.$,
            then: this.exp as Formula,
            otherwise: { type: 'boolean', value: false },
        })

    }

    else(formula: ExpBuilder<Formula>): ExpBuilder<IfElse> {

        if (this.exp.type !== 'if-else') {
            throw new Error(`'else' does not apply to ${this.exp.type}`)
        }

        return new ExpBuilder({
            ...this.exp as IfElse,
            otherwise: formula.$,
        })

    }

    get exists(): ExpBuilder<ExistentialQuantification> {

        if (this.exp.type !== 'variable') {
            throw new Error(``)
        }

        return new ExpBuilder({
            type: 'existquant',
            variable: this.exp as Variable,
            where: { type: 'boolean', value: false },
        })

    }

    where(formula: ExpBuilder<Formula>): ExpBuilder<ExistentialQuantification> {

        if (this.exp.type !== 'existquant') {
            throw new Error(``)
        }

        return new ExpBuilder({
            ...this.exp as ExistentialQuantification,
            where: formula.$ as Formula
        })

    }

    get $(): T {
        return this.exp
    }

}

type Var = `${string}:${string}`
type ListPat = `${Var}|${Var}`

function isVar(x: string): x is Var {
    return x.includes(':')
}

function makeAtom(x: ListPat): ListPattern
function makeAtom(x: Var): Variable
function makeAtom(x: string[]): ListLiteral
function makeAtom(x: string): Constant
function makeAtom(x: string | string[]): Atom

function makeAtom(x: string | string[]): Atom {

    if (x instanceof Array) {
        return {
            type: 'list-literal',
            list: x.map(e => makeAtom(e))
        }
    } else if (x.includes('|')) {
        const [seq, tail] = x.split('|')

        if (!isVar(seq) || !isVar(tail)) {
            throw new Error(``)
        }

        return {
            type: 'list-pattern',
            seq: makeAtom(seq),
            tail: makeAtom(tail),
        }
    } else if (isVar(x)) {
        const [name, varType] = x.split(':')
        return { type: 'variable', name, varType }
    } else if (['true', 'false'].includes(x)) {
        return { type: 'boolean', value: x === 'true' ? true : false }
    } else {
        return { type: 'constant', value: x }
    }

}