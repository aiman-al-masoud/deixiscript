import { tell } from "./tell.ts"
import { LLangAst, Atom, AtomicFormula, Conjunction, Constant, DerivationClause, Disjunction, Equality, ExistentialQuantification, HasFormula, IfElse, IsAFormula, ListLiteral, ListPattern, Variable, GeneralizedFormula, Number, Boolean, WmAtom, Entity, MathExpression, HappenSentence, StringLiteral, ImplicitReference, Question, Command, isLLangAst, ArbitraryType, KnowledgeBase, Nothing, Negation, SimpleFormula, isAtomicFormula } from "./types.ts"


export class ExpBuilder<T extends LLangAst> {

    constructor(readonly exp: T) { }

    equals(object: ExpBuilderArg) {

        return new ExpBuilder<Equality>({
            type: 'equality',
            subject: this.exp,
            object: makeAst(object),
        })

    }

    isa(object: ExpBuilderArg) {

        return new ExpBuilder<IsAFormula>({
            type: 'is-a-formula',
            subject: this.exp,
            object: makeAst(object),
        })

    }

    has(object: ExpBuilderArg) {

        return new ExpBuilder<HasFormula>({
            type: 'has-formula',
            subject: this.exp,
            object: makeAst(object),
            as: $('thing').$,
        })

    }

    as(role: ExpBuilderArg) {

        if (this.exp.type !== 'has-formula') {
            throw new Error(`'as' does not apply to ${this.exp.type}, only to HasFormula`)
        }

        return new ExpBuilder<HasFormula>({
            type: 'has-formula',
            subject: this.exp.subject,
            object: this.exp.object,
            as: makeAst(role),
        })

    }

    after(atom: ExpBuilderArg) {

        if (!isAtomicFormula(this.exp) && this.exp.type !== 'generalized') {
            throw new Error(``)
        }

        return new ExpBuilder<DerivationClause>({
            type: 'derivation-clause',
            conseq: this.exp as AtomicFormula | GeneralizedFormula,
            after: makeAst(atom),
        })
    }

    when(formula: ExpBuilderArg) {

        if (!isAtomicFormula(this.exp) && this.exp.type !== 'generalized') {
            throw new Error(``)
        }

        return new ExpBuilder<DerivationClause>({
            type: 'derivation-clause',
            conseq: this.exp as AtomicFormula | GeneralizedFormula,
            when: makeAst(formula),
        })

    }

    and(formula: ExpBuilderArg) {

        return new ExpBuilder<Conjunction>({
            type: 'conjunction',
            f1: this.exp,
            f2: makeAst(formula),
        })

    }

    or(formula: ExpBuilderArg) {

        return new ExpBuilder<Disjunction>({
            type: 'disjunction',
            f1: this.exp,
            f2: makeAst(formula),
        })

    }

    if(formula: ExpBuilderArg) {

        return new ExpBuilder<IfElse>({
            type: 'if-else',
            condition: makeAst(formula),
            then: this.exp,
            otherwise: $(false).$,
        })

    }

    else(formula: ExpBuilderArg) {

        if (this.exp.type !== 'if-else') {
            throw new Error(`'else' does not apply to ${this.exp.type}`)
        }

        return new ExpBuilder<IfElse>({
            ...this.exp,
            otherwise: makeAst(formula),
        })

    }

    get exists() {

        if (this.exp.type === 'implicit-reference' || this.exp.type === 'arbitrary-type') {
            return new ExpBuilder<ExistentialQuantification>({
                type: 'existquant',
                value: this.exp,
            })
        }

        if (this.exp.type !== 'variable') {
            throw new Error(``)
        }

        return new ExpBuilder<ExistentialQuantification>({
            type: 'existquant',
            value: {
                type: 'arbitrary-type',
                head: this.exp as Variable,
                description: $(false).$
            }
        })

    }

    where(formula: ExpBuilderArg) {

        if (this.exp.type !== 'existquant') throw new Error(``)

        if (this.exp.value.type !== 'arbitrary-type') throw new Error(``)

        return new ExpBuilder<ExistentialQuantification>({
            type: 'existquant',
            value: {
                head: this.exp.value.head,
                description: makeAst(formula),
                type: 'arbitrary-type',
            }
        })

    }

    get isNotTheCase() {

        return new ExpBuilder<Negation>({
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

    whose(ast: ExpBuilder<SimpleFormula>) {

        if (this.exp.type !== 'implicit-reference') {
            throw new Error('')
        }

        return new ExpBuilder<ImplicitReference>({
            ...this.exp,
            whose: makeAst(ast),
        })

    }

    which(ast: ExpBuilder<SimpleFormula>) {

        if (this.exp.type !== 'implicit-reference') {
            throw new Error('')
        }

        return new ExpBuilder<ImplicitReference>({
            ...this.exp,
            which: ast.$,
        })

    }

    protected mathOperation(ast: ExpBuilderArg, op: MathExpression['operator']) {
        return new ExpBuilder<MathExpression>({
            type: 'math-expression',
            left: this.exp as Atom,
            right: makeAst(ast) as MathExpression,
            operator: op,
        })
    }

    plus(ast: ExpBuilderArg) {
        return this.mathOperation(ast, '+')
    }

    minus(ast: ExpBuilderArg) {
        return this.mathOperation(ast, '-')
    }

    times(ast: ExpBuilderArg) {
        return this.mathOperation(ast, '*')
    }

    over(ast: ExpBuilderArg) {
        return this.mathOperation(ast, '/')
    }

    isGreaterThan(atom: ExpBuilderArg) {
        return this.mathOperation(atom, '>')
    }

    isLesserThan(atom: ExpBuilderArg) {
        return this.mathOperation(atom, '<')
    }

    isGreaterThanOrEqual(atom: ExpBuilderArg) {
        return this.mathOperation(atom, '>=')
    }

    isLessThanOrEqual(atom: ExpBuilderArg) {
        return this.mathOperation(atom, '<=')
    }

    get happens(): ExpBuilder<HappenSentence> {

        return new ExpBuilder<HappenSentence>({
            type: 'happen-sentence',
            subject: this.exp as Entity,
        })
    }

    get ask(): ExpBuilder<Question> {
        return new ExpBuilder<Question>({
            type: 'question',
            f1: this.exp,
        })
    }

    get tell(): ExpBuilder<Command> {
        return new ExpBuilder<Command>({
            type: 'command',
            f1: this.exp,
        })
    }

    suchThat(description?: ExpBuilderArg) {

        if (this.exp.type !== 'variable') throw new Error(``)

        return new ExpBuilder<ArbitraryType>({
            type: 'arbitrary-type',
            head: this.exp,
            description: description ? makeAst(description) : $(true).$,
        })

    }

    of(owner: ExpBuilderArg) {
        return $.the('thing').which($(makeAst(owner)).has($._.$).as(this.exp))
    }

    is(object: ExpBuilderArg) {
        return $({ subject: this.exp, verb: 'be', object: makeAst(object) })
    }

    does(verb: ExpBuilderArg) {
        return $({ subject: this.exp, verb: makeAst(verb) })
    }

    _(object: ExpBuilderArg) {
        if (this.exp.type !== 'generalized') throw new Error('')
        return $({ ...this.exp, object: makeAst(object) })
    }


    in(location: ExpBuilderArg): ExpBuilder<LLangAst> {

        if (this.exp.type === 'implicit-reference') {
            return new ExpBuilder<ImplicitReference>({
                ...this.exp,
                location: makeAst(location),
            })
        }

        if (this.exp.type === 'generalized') {

            return new ExpBuilder({
                ...this.exp,
                location: makeAst(location),
            })
        }

        throw new Error('')

    }

}


type ExpBuilderArg = WmAtom | LLangAst | ExpBuilder<LLangAst> | WmAtom[]
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
function makeAst(x: 'nothing'): Nothing
function makeAst(x: string): Constant
function makeAst(x: WmAtom | WmAtom[]): Atom
function makeAst<T extends LLangAst>(x: T): T
function makeAst<T extends LLangAst>(x: ExpBuilder<T>): T
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
    } else if (x === 'nothing') {
        return { type: 'nothing', value: '~' }
    } else {
        return { type: 'entity', value: x }
    }

}


export function $(x: ListPat): ExpBuilder<ListPattern>
export function $(x: Var): ExpBuilder<Variable>
export function $(x: StringLiteralPattern): ExpBuilder<StringLiteral>
export function $(x: WmAtom[]): ExpBuilder<ListLiteral>
export function $(x: 'nothing'): ExpBuilder<Nothing>
export function $(x: string): ExpBuilder<Entity>
export function $(x: number): ExpBuilder<Number>
export function $(x: boolean): ExpBuilder<Boolean>
export function $(x: LLangAst): ExpBuilder<LLangAst>
export function $(x: GeneralizedInput): ExpBuilder<GeneralizedFormula>
export function $(x: WmAtom): ExpBuilder<Constant>
export function $(x: WmAtom | WmAtom[] | GeneralizedInput | LLangAst): ExpBuilder<LLangAst>

export function $(x: WmAtom | WmAtom[] | GeneralizedInput | LLangAst): ExpBuilder<LLangAst> {

    if (typeof x === 'boolean' || typeof x === 'string' || typeof x === 'number' || x instanceof Array || isLLangAst(x)) {
        return new ExpBuilder(makeAst(x))
    }

    const keys = Object.fromEntries(
        Object.entries(x).map(e => [e[0], makeAst(e[1])])
    )

    return new ExpBuilder({ ...keys, type: 'generalized', /* after: $([]).$ */ } as GeneralizedFormula)
}

/**
 * Omitted subject for relative clauses, as in Linguistic Gapping. 
 * https://en.wikipedia.org/wiki/Relative_clause#Formation_methods
 */
$._ = $('')

/**
 * Creates an Anaphor.
 */
$.the = (x: string) => new ExpBuilder<ImplicitReference>({
    type: 'implicit-reference',
    headType: x,
    number: 1,
})

/**
 * See `$.the()`
 */
$.a = $.the

/**
 * Empty knowledge base.
 */
$.emptyKb = { wm: [], derivClauses: [], deicticDict: {} } as KnowledgeBase
