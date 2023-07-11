import { tell } from "./tell.ts"
import { LLangAst, Atom, AtomicFormula, Conjunction, Constant, DerivationClause, Disjunction, Equality, ExistentialQuantification, Formula, HasFormula, IfElse, IsAFormula, ListLiteral, ListPattern, Variable, GeneralizedFormula, Number, Boolean, WmAtom, isFormulaWithAfter, Entity, MathExpression, HappenSentence, StringLiteral, Anaphor, Question, Command, isLLangAst, Anything } from "./types.ts"

export function $(x: ListPat): ExpBuilder<ListPattern>
export function $(x: Var): ExpBuilder<Variable>
export function $(x: StringLiteralPattern): ExpBuilder<StringLiteral>
export function $(x: WmAtom[]): ExpBuilder<ListLiteral>
export function $(x: 'anything'): ExpBuilder<Anything>
export function $(x: string): ExpBuilder<Entity>
export function $(x: number): ExpBuilder<Number>
export function $(x: boolean): ExpBuilder<Boolean>
export function $(x: LLangAst): ExpBuilder<LLangAst>
export function $(x: GeneralizedInput): ExpBuilder<GeneralizedFormula>
export function $(x: WmAtom): ExpBuilder<Constant>

export function $(x: WmAtom | WmAtom[] | GeneralizedInput | LLangAst): ExpBuilder<LLangAst> {

    if (typeof x === 'boolean' || typeof x === 'string' || typeof x === 'number' || x instanceof Array || isLLangAst(x)) {
        return new ExpBuilder(makeAst(x))
    }

    const keys = Object.fromEntries(
        Object.entries(x).map(e => [e[0], makeAst(e[1])])
    )

    return new ExpBuilder({ ...keys, type: 'generalized', after: $([]).$ } as GeneralizedFormula)
}




export class ExpBuilder<T extends LLangAst> {

    constructor(readonly exp: T) {

    }

    equals(term: WmAtom | WmAtom[] | LLangAst): ExpBuilder<Equality> {

        return new ExpBuilder({
            type: 'equality',
            t1: this.exp,
            t2: makeAst(term),
        })

    }

    isa(term: WmAtom | LLangAst | ExpBuilder<LLangAst>): ExpBuilder<IsAFormula> {

        return new ExpBuilder({
            type: 'is-a-formula',
            t1: this.exp,
            t2: makeAst(term),
            after: $([]).$
        })

    }

    has(term: WmAtom | LLangAst | ExpBuilder<LLangAst>): ExpBuilder<HasFormula> {

        return new ExpBuilder({
            type: 'has-formula',
            t1: this.exp,
            t2: makeAst(term),
            as: $('anything').$,
            after: $([]).$
        })

    }

    as(role: WmAtom | LLangAst): ExpBuilder<HasFormula> {

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

    after(atom: string | string[] | LLangAst): ExpBuilder<AtomicFormula | GeneralizedFormula> {

        if (!isFormulaWithAfter(this.exp)) {
            throw new Error(`'after' does not apply to ${this.exp.type}, only to AtomicFormula`)
        }

        return new ExpBuilder({
            ...this.exp,
            after: makeAst(atom),
        })
    }

    when(formula: ExpBuilder<LLangAst> | LLangAst): ExpBuilder<DerivationClause> {

        if (!isFormulaWithAfter(this.exp)) {
            throw new Error(`the 'conseq' of a DerivationClause must be an SimpleFormula not a ${this.exp.type}`)
        }

        return new ExpBuilder({
            type: 'derived-prop',
            when: makeAst(formula),
            conseq: this.exp,
        })

    }

    and(formula: ExpBuilder<LLangAst> | WmAtom | LLangAst): ExpBuilder<Conjunction> {

        return new ExpBuilder({
            type: 'conjunction',
            f1: this.exp,
            f2: makeAst(formula),
        })

    }

    or(formula: ExpBuilder<Formula> | WmAtom | LLangAst): ExpBuilder<Disjunction> {

        return new ExpBuilder({
            type: 'disjunction',
            f1: this.exp,
            f2: makeAst(formula),
        })

    }

    if(formula: ExpBuilder<LLangAst> | LLangAst): ExpBuilder<IfElse> {

        return new ExpBuilder({
            type: 'if-else',
            condition: makeAst(formula),
            then: this.exp,
            otherwise: $(false).$,
        })

    }

    else(formula: ExpBuilder<Formula> | LLangAst): ExpBuilder<IfElse> {

        if (this.exp.type !== 'if-else') {
            throw new Error(`'else' does not apply to ${this.exp.type}`)
        }

        return new ExpBuilder({
            ...this.exp as IfElse,
            otherwise: makeAst(formula),
        })

    }

    get exists(): ExpBuilder<ExistentialQuantification> {

        if (this.exp.type !== 'variable') {
            throw new Error(``)
        }

        return new ExpBuilder({
            type: 'existquant',
            variable: this.exp as Variable,
            where: $(false).$,
        })

    }

    where(formula: ExpBuilder<Formula> | LLangAst): ExpBuilder<ExistentialQuantification> {

        if (this.exp.type !== 'existquant') {
            throw new Error(``)
        }

        return new ExpBuilder({
            ...this.exp as ExistentialQuantification,
            where: makeAst(formula),
        })

    }

    get isNotTheCase() {

        return new ExpBuilder({
            type: 'negation',
            f1: this.exp,
        })
    }

    get $(): T {
        return this.exp
    }

    dump(dcs?: DerivationClause[]) {
        return tell(this.exp, { wm: [], derivClauses: dcs ? dcs : [], deicticDict: {}, })
    }

    whose(ast: ExpBuilder<HasFormula | IsAFormula | Equality>): ExpBuilder<Anaphor> {

        if (this.exp.type !== 'anaphor') {
            throw new Error('')
        }

        return new ExpBuilder<Anaphor>({
            ...this.exp,
            whose: ast.$,
        })

    }

    which(ast: ExpBuilder<HasFormula | IsAFormula | Equality>): ExpBuilder<Anaphor> {

        if (this.exp.type !== 'anaphor') {
            throw new Error('')
        }

        return new ExpBuilder<Anaphor>({
            ...this.exp,
            which: ast.$,
        })

    }

    protected mathOperation(ast: MathExpression | Atom | WmAtom, op: MathExpression['operator']) {
        return new ExpBuilder({
            type: 'math-expression',
            left: this.exp as Atom,
            right: makeAst(ast) as MathExpression,
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
function makeAst(x: 'anything'): Anything
function makeAst(x: string): Constant
function makeAst(x: WmAtom | WmAtom[]): Atom
function makeAst(x: LLangAst): LLangAst
function makeAst(x: WmAtom | WmAtom[] | LLangAst | ExpBuilder<LLangAst>): LLangAst

function makeAst(x: WmAtom | WmAtom[] | LLangAst | ExpBuilder<LLangAst>): LLangAst {

    if (x instanceof ExpBuilder) {
        return x.$
    } else if (isLLangAst(x)) {
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
    } else if (x === 'anything') {
        return { type: 'anything', value: '*' }
    } else {
        return { type: 'entity', value: x }
    }

}

/**
 * Don't-care subject. 
 */
$._ = $('')
// Object.defineProperty($, '$', { get: () => $('') })

$.the = (x: string): ExpBuilder<Anaphor> => {
    return new ExpBuilder({
        type: 'anaphor',
        headType: x,
        number: 1,
    })
}

$.a = $.the