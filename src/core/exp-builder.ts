import { tell } from "./tell.ts"
import { LLangAst, Atom, Conjunction, Constant, Disjunction, ExistentialQuantification, HasFormula, IfElse, IsAFormula, List, Variable, GeneralizedFormula, Number, Boolean, WmAtom, Entity, MathExpression, ImplicitReference, Question, Command, isLLangAst, ArbitraryType, KnowledgeBase, Nothing, Negation, WhenDerivationClause, AfterDerivationClause, Cardinality } from "./types.ts"


export class ExpBuilder<T extends LLangAst> {

    constructor(readonly exp: T) { }

    equals(object: ExpBuilderArg) {
        return this.mathOperation(object, '=')
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

    when(formula: ExpBuilderArg) {

        return new ExpBuilder<WhenDerivationClause>({
            type: 'when-derivation-clause',
            conseq: this.exp,
            when: makeAst(formula),
        })

    }

    after(atom: ExpBuilderArg) {

        return new ExpBuilder<AfterDerivationClause>({
            type: 'after-derivation-clause',
            conseq: this.exp,
            after: makeAst(atom),
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

    get isNotTheCase() {

        return new ExpBuilder<Negation>({
            type: 'negation',
            f1: this.exp,
        })
    }

    get $(): T {
        return this.exp
    }

    dump(kb?: KnowledgeBase) {
        return tell(this.exp, kb ?? $.emptyKb).kb
    }

    which(ast: ExpBuilder<LLangAst>) {

        // if (this.exp.type !== 'implicit-reference') {
        //     throw new Error('')
        // }

        return new ExpBuilder<ImplicitReference>({
            ...this.exp,
            which: ast.$,
        } as ImplicitReference)

    }

    mathOperation(ast: ExpBuilderArg, op: ExpBuilderArg) {
        return new ExpBuilder<MathExpression>({
            type: 'math-expression',
            left: this.exp as Atom,
            right: makeAst(ast) as MathExpression,
            operator: makeAst(op),
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
            description: makeAst(description ?? true),
            number: $(1).$,
            // isNew: false,
        })

    }

    is(object: ExpBuilderArg) {
        return $({ subject: this.exp, verb: 'be', object: makeAst(object) })
    }

    does(verb: ExpBuilderArg) {
        return $({ subject: this.exp, verb: makeAst(verb), object: $._.$ })
    }

    _(object: ExpBuilderArg) {
        if (this.exp.type !== 'generalized') throw new Error('')
        return $({ ...this.exp, object: makeAst(object) })
    }

    complement(comp: ExpBuilderArg, name: string): ExpBuilder<LLangAst> {

        // if (this.exp.type !== 'implicit-reference' && this.exp.type !== 'generalized') {
        //     throw new Error(`bad exp.type=${this.exp.type}`)
        // }

        return new ExpBuilder({
            type: 'complement',
            complement: makeAst(comp),
            complementName: makeAst(name),
            phrase: this.exp,
        })

    }

    in(location: ExpBuilderArg) {
        return this.complement(location, 'location')
    }

    for(beneficiary: ExpBuilderArg) {
        return this.complement(beneficiary, 'beneficiary')
    }

    of(owner: ExpBuilderArg) {
        return this.complement(owner, 'owner')
    }

}

type ExpBuilderArg = WmAtom | LLangAst | ExpBuilder<LLangAst> | WmAtom[]
type GeneralizedInput = { [key: string]: LLangAst | WmAtom | WmAtom[] | LLangAst[] | (LLangAst | WmAtom)[] }
type Var = `${string}:${string}`
type ListPat = `${Var}|${string}`
type StringLiteralPattern = `"${string}"`

function isVar(x: string): x is Var {
    return x.includes(':')
}

function isStringLiteral(x: string): x is StringLiteralPattern {
    return x.at(0) === '"' && x.at(-1) === '"'
}

function makeAst(x: Var): Variable
function makeAst(x: StringLiteralPattern): Entity
function makeAst(x: WmAtom[]): List
function makeAst(x: number): Number
function makeAst(x: boolean): Boolean
function makeAst(x: 'nothing'): Nothing
function makeAst(x: string): Constant
function makeAst(x: WmAtom | WmAtom[]): Atom
function makeAst(x: (LLangAst | WmAtom)[]): LLangAst
function makeAst(x: LLangAst[]): LLangAst
function makeAst<T extends LLangAst>(x: T): T
function makeAst<T extends LLangAst>(x: ExpBuilder<T>): T
function makeAst(x: WmAtom | WmAtom[] | LLangAst | ExpBuilder<LLangAst>): LLangAst
function makeAst(x: LLangAst[] | WmAtom | WmAtom[] | LLangAst | ExpBuilder<LLangAst> | (LLangAst | WmAtom)[]): LLangAst
function makeAst(x: WmAtom | WmAtom[] | LLangAst | ExpBuilder<LLangAst> | LLangAst[] | (LLangAst | WmAtom)[]): LLangAst {

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
            type: 'list',
            value: x.map(e => makeAst(e))
        }
    } else if (isStringLiteral(x)) {
        return {
            type: 'entity',
            value: x.substring(1, x.length - 1),
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

export function $(x: Var): ExpBuilder<Variable>
export function $(x: StringLiteralPattern): ExpBuilder<Entity>
export function $(x: WmAtom[]): ExpBuilder<List>
export function $(x: 'nothing'): ExpBuilder<Nothing>
export function $(x: string): ExpBuilder<Entity>
export function $(x: number): ExpBuilder<Number>
export function $(x: boolean): ExpBuilder<Boolean>
export function $(x: LLangAst): ExpBuilder<LLangAst>
export function $(x: LLangAst[]): ExpBuilder<List>
export function $(x: (LLangAst | WmAtom)[]): ExpBuilder<List>
export function $(x: GeneralizedInput): ExpBuilder<GeneralizedFormula>
export function $(x: WmAtom): ExpBuilder<Constant>
export function $(x: WmAtom | WmAtom[] | GeneralizedInput | LLangAst | (LLangAst | WmAtom)[]): ExpBuilder<LLangAst>
export function $(x: WmAtom | WmAtom[] | GeneralizedInput | LLangAst | LLangAst[] | (LLangAst | WmAtom)[]): ExpBuilder<LLangAst> {

    if (typeof x === 'boolean' || typeof x === 'string' || typeof x === 'number' || x instanceof Array || isLLangAst(x)) {
        return new ExpBuilder(makeAst(x))
    }

    const keys = Object.fromEntries(
        Object.entries(x).map(e => [e[0], makeAst(e[1])])
    )

    return new ExpBuilder({ ...keys, type: 'generalized' } as GeneralizedFormula)
}

/**
 * Conventional empty subject, for (among other things) relative clauses, 
 * as in Linguistic Gapping. 
 * https://en.wikipedia.org/wiki/Relative_clause#Formation_methods
 */
$._ = $('')

function createImplicit(x: ExpBuilderArg) {
    return new ExpBuilder<ImplicitReference>({
        type: 'implicit-reference',
        headType: makeAst(x),
    } as ImplicitReference)
}

function makeNumber(x: ExpBuilderArg, number: 1 | '*') {
    return new ExpBuilder<Cardinality>({
        type: 'cardinality',
        value: makeAst(x),
        number : $(number).$,
        // isNew: false,
    })
}

/**
 * Creates an ImplicitReference.
 */
$.the = (x: ExpBuilderArg) => makeNumber(createImplicit(x), 1)
$.a = (x: ExpBuilderArg) => makeNumber(createImplicit(x), 1)
$.every = (x: ExpBuilderArg) => makeNumber(createImplicit(x), '*')

/**
 * Empty knowledge base.
 */
$.emptyKb = { wm: [], derivClauses: [], deicticDict: {} } as KnowledgeBase

/**
 * Parse derivation clause (shorthand).
 */
$.p = (ast: ExpBuilderArg) => $({ parse: makeAst(ast) })

/**
 * Existential Quantificator
 */
$.thereIs = (ast: ExpBuilderArg) => new ExpBuilder<ExistentialQuantification>({
    type: 'existquant',
    value: makeAst(ast),
})