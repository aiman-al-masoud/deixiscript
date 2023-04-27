import { LexemeType } from "../../../config/LexemeType"
import { Lexeme } from "../../lexer/Lexeme"
import { AstType } from "./Syntax"


export type AstNode =
    NounPhrase
    | AndPhrase
    | LimitPhrase
    | MathExpression
    | GenitiveComplement
    | CopulaSentence
    | VerbSentence
    | Macro
    | Macropart
    | Exceptunion
    | NumberLiteral
    | StringAst
    | ComplexSentence
    | AtomNode<LexemeType>

export interface GeneralAstNode<T extends AstType> {
    readonly type: T
    readonly lexeme?: Lexeme
    readonly role?: Role
    readonly list?: any[]
}

export interface AtomNode<T extends LexemeType> extends GeneralAstNode<T> {
    readonly lexeme: Lexeme
    readonly list?: undefined
}

export interface NounPhrase extends GeneralAstNode<'noun-phrase'> {

    // quantifier?: AtomNode<'uniquant' | 'existquant'>
    // article?: AtomNode<'defart' | 'indefart'>
    uniquant?: AtomNode<'uniquant'>
    existquant?: AtomNode<'existquant'>
    defart?: AtomNode<'defart'>
    indefart?: AtomNode<'indefart'>
    subject: AtomNode<'noun' | 'pronoun'> | StringAst | NumberLiteral
    adjective?: { list: AtomNode<'adjective'>[] }
    subclause?: AstNode
    'genitive-complement'?: GenitiveComplement
    'and-phrase'?: AndPhrase
    'math-expression'?: MathExpression
    'limit-phrase'?: LimitPhrase
    role: Role
    list?: undefined
}

export interface AndPhrase extends GeneralAstNode<'and-phrase'> {
    nonsubconj: AtomNode<'nonsubconj'>
    'noun-phrase': NounPhrase
}

export interface LimitPhrase extends GeneralAstNode<'limit-phrase'> {
    /* TODO: name not in runtime! */ nextOrPrevKeyword: AtomNode<'next-keyword' | 'previous-keyword'>
    'number-literal'?: NumberLiteral
}

export interface MathExpression extends GeneralAstNode<'math-expression'> {
    operator: AtomNode<'plus-operator'>
    'noun-phrase': NounPhrase
}

export interface Complement<T extends AstType> extends GeneralAstNode<T> { }

export interface GenitiveComplement extends Complement<'genitive-complement'> {
    'genitive-particle': AtomNode<'genitive-particle'>
    owner: NounPhrase
}

export interface DativeComplement extends Complement<'dative-complement'> {
    'dative-particle': AtomNode<'dative-particle'>
    owner: NounPhrase
}

export interface AblativeComplement extends Complement<'ablative-complement'> {
    'ablative-particle': AtomNode<'ablative-particle'>
    origin: NounPhrase
}

export interface LocativeComplement extends Complement<'locative-complement'> {
    'locative-particle': AtomNode<'locative-particle'>
    location: NounPhrase
}

export interface InstrumentalComplement extends Complement<'instrumental-complement'> {
    'instrumental-particle': AtomNode<'instrumental-particle'>
    instrument: NounPhrase
}

export interface ComitativeComplement extends Complement<'comitative-complement'> {
    'comitative-particle': AtomNode<'comitative-particle'>
    companion: NounPhrase
}

export interface CopulaSentence extends GeneralAstNode<'copula-sentence'> {
    subject: NounPhrase
    copula: AtomNode<'copula'>
    negation?: AtomNode<'negation'>
    predicate: NounPhrase
}

export interface VerbSentence extends GeneralAstNode<'verb-sentence'> {
    subject: NounPhrase
    hverb?: AtomNode<'hverb'>
    negation?: AtomNode<'negation'>
    verb: AtomNode<'verb'>
    object?: NounPhrase
    complement?: { list: (DativeComplement | AblativeComplement | LocativeComplement | ComitativeComplement | InstrumentalComplement)[] }
}

export interface Macro extends GeneralAstNode<'macro'> {
    macropart: { list: Macropart[] }
    subject: AtomNode<'noun'>
}

export interface Macropart extends GeneralAstNode<'macropart'> {
    adjective: { list: AtomNode<'adjective'>[] }
    taggedunion: { list: Taggedunion[] }
    exceptunion: Exceptunion
}

export interface Exceptunion extends GeneralAstNode<'exceptunion'> {
    taggedunion: { list: Taggedunion[] }
}

export interface Taggedunion extends GeneralAstNode<'taggedunion'> {
    noun: AtomNode<'noun'>
}

export interface ComplexSentence extends GeneralAstNode<'complex-sentence'> {
    condition: CopulaSentence | VerbSentence
    consequence: CopulaSentence | VerbSentence
    subconj: AtomNode<'subconj'>
}

export interface StringAst extends GeneralAstNode<'string'> {
    'string-token': { list: AtomNode<LexemeType>[] }
}

export interface NumberLiteral extends GeneralAstNode<'number-literal'> {
    'first-digit': AtomNode<'digit'>
    'digit': { list: AtomNode<'digit'>[] }
}

export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'
    | 'owner'
    | 'operator'
