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

export interface AtomNode extends GeneralAstNode<LexemeType> {
    readonly lexeme: Lexeme
    readonly role?: Role
}

export interface ListNode extends GeneralAstNode<AstType> {
    readonly list: AstNode[]
}

export interface NounPhrase extends GeneralAstNode<'noun-phrase'> {
    
    readonly type:'noun-phrase',

    readonly links: {
        quantifier?: AtomNode,
        article?: AtomNode,
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
        nonsubconj: AtomNode,
        'noun-phrase': NounPhrase,
    }
}

export interface LimitPhrase extends GeneralAstNode<'limit-phrase'> {
    readonly links: {
        nextOrPrevKeyword: AtomNode,
        string?: AstNode,
    }
}

export interface MathExpression extends GeneralAstNode<'math-expression'> {
    readonly links: {
        operator: AtomNode,
        'noun-phrase': NounPhrase,
    }
}

export interface GenitiveComplement extends GeneralAstNode<'genitive-complement'> {
    readonly links: {
        'genitive-particle': AtomNode,
        owner: NounPhrase,
    }
}

export interface CopulaSentence extends GeneralAstNode<'copula-sentence'> {
    readonly links: {
        subject: NounPhrase,
        copula: AtomNode,
        negation?: AtomNode,
        predicate: NounPhrase,
    }
}

export interface VerbSentence extends GeneralAstNode<'verb-sentence'> {
    readonly links: {
        subject: NounPhrase,
        hverb?: AtomNode,
        negation?: AtomNode,
        verb: AtomNode,
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
