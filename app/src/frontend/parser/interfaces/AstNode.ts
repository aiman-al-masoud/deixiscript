import { LexemeType } from "../../../config/LexemeType"
import { CompositeType } from "../../../config/syntaxes"
import { Lexeme } from "../../lexer/Lexeme"


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
    | StringLiteral
    | ComplexSentence
    | Lexeme

export interface CompositeNode<T extends CompositeType = CompositeType> {
    readonly type: T
    readonly list?: any[]
}

export interface NounPhrase extends CompositeNode<'noun-phrase'> {
    uniquant?: Lexeme<'uniquant'>
    existquant?: Lexeme<'existquant'>
    defart?: Lexeme<'defart'>
    indefart?: Lexeme<'indefart'>
    subject: Lexeme<'noun' | 'pronoun'> | StringLiteral | NumberLiteral
    adjective?: { list: Lexeme<'adjective'>[] }
    subclause?: AstNode
    'genitive-complement'?: GenitiveComplement
    'and-phrase'?: AndPhrase
    'math-expression'?: MathExpression
    'limit-phrase'?: LimitPhrase
    list?: undefined
}

export interface AndPhrase extends CompositeNode<'and-phrase'> {
    nonsubconj: Lexeme<'nonsubconj'>
    'noun-phrase': NounPhrase
}

export interface LimitPhrase extends CompositeNode<'limit-phrase'> {
    /* TODO: name not in runtime! */ nextOrPrevKeyword: Lexeme<'next-keyword' | 'previous-keyword'>
    'number-literal'?: NumberLiteral
}

export interface MathExpression extends CompositeNode<'math-expression'> {
    operator: Lexeme<'plus-operator'>
    'noun-phrase': NounPhrase
}

export interface Complement<T extends CompositeType> extends CompositeNode<T> { }

export interface GenitiveComplement extends Complement<'genitive-complement'> {
    'genitive-particle': Lexeme<'genitive-particle'>
    owner: NounPhrase
}

export interface DativeComplement extends Complement<'dative-complement'> {
    'dative-particle': Lexeme<'dative-particle'>
    owner: NounPhrase
}

export interface AblativeComplement extends Complement<'ablative-complement'> {
    'ablative-particle': Lexeme<'ablative-particle'>
    origin: NounPhrase
}

export interface LocativeComplement extends Complement<'locative-complement'> {
    'locative-particle': Lexeme<'locative-particle'>
    location: NounPhrase
}

export interface InstrumentalComplement extends Complement<'instrumental-complement'> {
    'instrumental-particle': Lexeme<'instrumental-particle'>
    instrument: NounPhrase
}

export interface ComitativeComplement extends Complement<'comitative-complement'> {
    'comitative-particle': Lexeme<'comitative-particle'>
    companion: NounPhrase
}

export interface CopulaSentence extends CompositeNode<'copula-sentence'> {
    subject: NounPhrase
    copula: Lexeme<'copula'>
    negation?: Lexeme<'negation'>
    predicate: NounPhrase
}

export interface VerbSentence extends CompositeNode<'verb-sentence'> {
    subject?: NounPhrase
    hverb?: Lexeme<'hverb'>
    negation?: Lexeme<'negation'>
    verb: Lexeme<'verb'>
    object?: NounPhrase
    complement?: { list: (DativeComplement | AblativeComplement | LocativeComplement | ComitativeComplement | InstrumentalComplement)[] }
}

export interface Macro extends CompositeNode<'macro'> {
    macropart: { list: Macropart[] }
    subject: Lexeme<'noun'>
}

export interface Macropart extends CompositeNode<'macropart'> {
    cardinality?: Lexeme<'cardinality'>
    'grammar-role'?: Lexeme<'grammar-role'>
    taggedunion: { list: Taggedunion[] }
    exceptunion: Exceptunion
}

export interface Exceptunion extends CompositeNode<'exceptunion'> {
    taggedunion: { list: Taggedunion[] }
}

export interface Taggedunion extends CompositeNode<'taggedunion'> {
    noun: Lexeme<'noun'>
}

export interface ComplexSentence extends CompositeNode<'complex-sentence'> {
    condition: CopulaSentence | VerbSentence
    consequence: CopulaSentence | VerbSentence
    subconj: Lexeme<'subconj'>
}

export interface StringLiteral extends CompositeNode<'string'> {
    'string-token': { list: Lexeme<LexemeType>[] }
}

export interface NumberLiteral extends CompositeNode<'number-literal'> {
    digit: { list: Lexeme<'digit'>[] }
}
