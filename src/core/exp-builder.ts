import { tell } from "./tell.ts"
import { LLangAst, Atom, AtomicFormula, Conjunction, Constant, DerivationClause, Disjunction, Equality, ExistentialQuantification, Formula, HasFormula, IfElse, IsAFormula, isAtom, ListLiteral, ListPattern, Variable, GeneralizedFormula, Number, Boolean, WmAtom, isWmAtom, isFormulaWithAfter, Entity, MathExpression, HappenSentence, StringLiteral, Anaphor, Question, Command, isLLangAst } from "./types.ts"

export function $(x: ListPat): ExpBuilder<ListPattern>
export function $(x: Var): ExpBuilder<Variable>
export function $(x: StringLiteralPattern): ExpBuilder<StringLiteral>
export function $(x: WmAtom[]): ExpBuilder<ListLiteral>
export function $(x: string): ExpBuilder<Entity>
export function $(x: number): ExpBuilder<Number>
export function $(x: boolean): ExpBuilder<Boolean>
export function $(x: GeneralizedInput): ExpBuilder<GeneralizedFormula>
export function $(x: WmAtom): ExpBuilder<Constant>

export function $(x: WmAtom | WmAtom[] | GeneralizedInput): ExpBuilder<LLangAst> {

    if (typeof x === 'boolean' || typeof x === 'string' || typeof x === 'number' || x instanceof Array) {
        return new ExpBuilder(makeAst(x))
    }

    const keys = Object.fromEntries(
        Object.entries(x).map(e => [e[0], makeAst(e[1])])
    )

    return new ExpBuilder({ type: 'generalized', keys: keys, after: { value: [], type: 'list-literal' } })
}

export class ExpBuilder<T extends LLangAst> {

    constructor(readonly exp: T) {

    }

    equals(term: WmAtom | WmAtom[]): ExpBuilder<Equality> {

        return new ExpBuilder({
            type: 'equality',
            t1: this.exp,
            t2: makeAst(term),
        })

    }

    isa(term: WmAtom): ExpBuilder<IsAFormula> {

        return new ExpBuilder({
            type: 'is-a-formula',
            t1: this.exp,
            t2: makeAst(term),
            after: { type: 'list-literal', value: [] }
        })

    }

    has(term: WmAtom | ExpBuilder<Atom>): ExpBuilder<HasFormula> {

        const atom = isWmAtom(term) ? makeAst(term) : term.$

        return new ExpBuilder({
            type: 'has-formula',
            t1: this.exp,
            t2: atom,
            as: atom,
            after: { type: 'list-literal', value: [] },
        })

    }

    as(role: WmAtom): ExpBuilder<HasFormula> {

        if (this.exp.type !== 'has-formula') {
            throw new Error(`'as' does not apply to ${this.exp.type}, only to HasFormula`)

        }

        return new ExpBuilder({
            type: 'has-formula',
            t1: this.exp.t1,
            t2: this.exp.t2,
            as: makeAst(role),
            after: this.exp.after,
        })

    }

    after(atom: string | string[]): ExpBuilder<AtomicFormula | GeneralizedFormula> {

        if (!isFormulaWithAfter(this.exp)) {
            throw new Error(`'after' does not apply to ${this.exp.type}, only to AtomicFormula`)
        }

        return new ExpBuilder({
            ...this.exp,
            after: makeAst(atom),
        })
    }

    when(formula: ExpBuilder<LLangAst>): ExpBuilder<DerivationClause> {

        if (!isFormulaWithAfter(this.exp)) {
            throw new Error(`the 'conseq' of a DerivationClause must be an SimpleFormula not a ${this.exp.type}`)
        }

        return new ExpBuilder({
            type: 'derived-prop',
            when: formula.$,
            conseq: this.exp,
        })

    }

    and(formula: ExpBuilder<LLangAst>): ExpBuilder<Conjunction> {

        return new ExpBuilder({
            type: 'conjunction',
            f1: this.exp,
            f2: formula.$,
        })

    }

    or(formula: ExpBuilder<Formula>): ExpBuilder<Disjunction> {

        return new ExpBuilder({
            type: 'disjunction',
            f1: this.exp as Formula,
            f2: formula.$,
        })

    }

    if(formula: ExpBuilder<LLangAst>): ExpBuilder<IfElse> {

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


    get isNotTheCase() {

        return new ExpBuilder({
            type: 'negation',
            f1: this.exp as Formula
        })
    }

    get $(): T {
        return this.exp
    }

    dump(dcs?: DerivationClause[]) {
        return tell(this.exp, { wm: [], derivClauses: dcs ? dcs : [], deicticDict: {}, })
    }

    suchThat(formula?: ExpBuilder<LLangAst>): ExpBuilder<Anaphor> {

        if (this.exp.type !== 'variable') {
            throw new Error('head of anaphor must be variable!')
        }

        return new ExpBuilder<Anaphor>({
            type: 'anaphor',
            head: this.exp,
            description: formula ? formula.$ : $(true).$,
        })

    }

    protected mathOperation(ast: MathExpression | Atom | WmAtom, op: MathExpression['operator']) {
        return new ExpBuilder({
            type: 'math-expression',
            left: this.exp as MathExpression,
            right: typeof ast !== 'object' ? makeAst(ast) : ast,
            operator: op,
        })
    }

    plus(ast: MathExpression | Atom | WmAtom) {
        return this.mathOperation(ast, '+')
    }

    minus(ast: MathExpression | Atom | WmAtom) {
        return this.mathOperation(ast, '-')
    }

    times(ast: MathExpression | Atom | WmAtom) {
        return this.mathOperation(ast, '*')
    }

    over(ast: MathExpression | Atom | WmAtom) {
        return this.mathOperation(ast, '/')
    }

    isGreaterThan(atom: WmAtom) {
        return this.mathOperation(atom, '>')
    }

    get happens(): ExpBuilder<HappenSentence> {

        return new ExpBuilder({
            type: 'happen-sentence',
            event: this.exp as Entity,
        })
    }

    get ask(): ExpBuilder<Question> {
        return new ExpBuilder({
            type: 'question',
            f1: this.exp,
        })
    }

    get tell(): ExpBuilder<Command> {
        return new ExpBuilder({
            type: 'command',
            f1: this.exp,
        })
    }

}

type GeneralizedInput = { [key: string]: LLangAst | WmAtom | WmAtom[] }
type Var = `${string}:${string}`
type ListPat = `${Var}|${Var}`
type StringLiteralPattern = `"${string}"`

function isVar(x: string): x is Var {
    return x.includes(':')
}

function isStringLiteral(x: string): x is StringLiteralPattern {
    return x.at(0) === '"' && x.at(-1) === '"'
}

function makeAst(x: ListPat): ListPattern
function makeAst(x: Var): Variable
function makeAst(x: StringLiteralPattern): StringLiteral
function makeAst(x: WmAtom[]): ListLiteral
function makeAst(x: number): Number
function makeAst(x: boolean): Boolean
function makeAst(x: string): Constant
function makeAst(x: WmAtom | WmAtom[]): Atom
function makeAst(x: LLangAst): LLangAst
function makeAst(x: WmAtom | WmAtom[] | LLangAst): LLangAst
function makeAst(x: WmAtom | WmAtom[] | LLangAst): LLangAst {

    if (isLLangAst(x)) {
        return x
    } else if (typeof x === 'number') {
        return { type: 'number', value: x }
    } else if (typeof x === 'boolean') {
        return { type: 'boolean', value: x }
    } else if (x instanceof Array) {
        return {
            type: 'list-literal',
            value: x.map(e => makeAst(e))
        }
    } else if (isStringLiteral(x)) {
        return {
            type: 'string',
            value: x.substring(1, x.length - 1),
        }
    } else if (x.includes('|')) {
        const [seq, tail] = x.split('|')

        if (!isVar(seq) || !isVar(tail)) {
            throw new Error(``)
        }

        return {
            type: 'list-pattern',
            seq: makeAst(seq),
            value: makeAst(tail),
        }
    } else if (isVar(x)) {
        const [value, varType] = x.split(':')
        return { type: 'variable', value, varType }
    } else {
        return { type: 'entity', value: x }
    }

}
