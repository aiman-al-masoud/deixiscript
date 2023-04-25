import { LexemeType } from "../../../config/LexemeType"
import { Lexeme } from "../../lexer/Lexeme"
import { AstType } from "./Syntax"

/**
* philosophy: fixed ASTs, custom CSTs.
*/

export interface GeneralAstNode<T extends AstType> {
    readonly type: T
}

export interface AstNode extends GeneralAstNode<AstType> { // to be phased out
    readonly links?: { [index in AstType | Role]?: AstNode }
    readonly lexeme?: Lexeme
    readonly list?: AstNode[]
    readonly role?: Role
}

export interface AtomNode<T extends LexemeType> extends GeneralAstNode<T> {
    readonly lexeme: Lexeme
    readonly role?: Role
}

export interface ListNode extends GeneralAstNode<AstType> {
    readonly list: AstNode[]
}

export interface NounPhrase extends GeneralAstNode<'noun-phrase'> {

    readonly type: 'noun-phrase',

    readonly links: {
        quantifier?: AtomNode<'uniquant' | 'existquant'>,
        article?: AtomNode<'defart' | 'indefart'>,
        subject?: ListNode,
        adjective?: ListNode,
        subclause?: AstNode,
        'genitive-complement'?: GenitiveComplement,
        'and-phrase'?: AndPhrase,
        'math-expression'?: MathExpression,
        'limit-phrase'?: LimitPhrase,
    }
    readonly role: Role,
}

export interface AndPhrase extends GeneralAstNode<'and-phrase'> {
    readonly links: {
        nonsubconj: AtomNode<'nonsubconj'>,
        'noun-phrase': NounPhrase,
    }
}

export interface LimitPhrase extends GeneralAstNode<'limit-phrase'> {
    readonly links: {
        /* TODO: name not in runtime! */nextOrPrevKeyword: AtomNode<'next-keyword' | 'previous-keyword'>,
        string?: AstNode,
    }
}

export interface MathExpression extends GeneralAstNode<'math-expression'> {
    readonly links: {
        operator: AtomNode<'plus-operator'>,
        'noun-phrase': NounPhrase,
    }
}

export interface GenitiveComplement extends GeneralAstNode<'genitive-complement'> {
    readonly links: {
        'genitive-particle': AtomNode<'genitive-particle'>,
        owner: NounPhrase,
    }
}

export interface CopulaSentence extends GeneralAstNode<'copula-sentence'> {
    readonly links: {
        subject: NounPhrase,
        copula: AtomNode<'copula'>,
        negation?: AtomNode<'negation'>,
        predicate: NounPhrase,
    }
}

export interface VerbSentence extends GeneralAstNode<'verb-sentence'> {
    readonly links: {
        subject: NounPhrase,
        hverb?: AtomNode<'hverb'>,
        negation?: AtomNode<'negation'>,
        verb: AtomNode<'verb'>,
        object?: NounPhrase,
        complement?: ListNode,
    }
}



export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'
    | 'owner'
    | 'operator'
