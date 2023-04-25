import { LexemeType } from "../../../config/LexemeType"
import { Lexeme } from "../../lexer/Lexeme"
import { AstType } from "./Syntax"


export type AstNode2 = NounPhrase | AndPhrase | LimitPhrase | MathExpression | GenitiveComplement | CopulaSentence | VerbSentence | Macro | Macropart | Exceptunion | StringAst | NumberLiteral | AtomNode<'defart'> | AtomNode<'noun'> | AtomNode<'pronoun'> 


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

export interface NounPhrase extends GeneralAstNode<'noun-phrase'> {

    readonly links: {
        quantifier?: AtomNode<'uniquant' | 'existquant'>,
        article?: AtomNode<'defart' | 'indefart'>,
        subject: AtomNode<'noun' | 'pronoun'> | StringAst | NumberLiteral
        adjective?: { list: AtomNode<'adjective'>[] },
        subclause?: AstNode2,
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
        'number-literal'?: NumberLiteral,
    }
}

export interface MathExpression extends GeneralAstNode<'math-expression'> {
    readonly links: {
        operator: AtomNode<'plus-operator'>,
        'noun-phrase': NounPhrase,
    }
}


export interface Complement<T extends AstType> extends GeneralAstNode<T> {
}

export interface GenitiveComplement extends Complement<'genitive-complement'> {
    readonly links: {
        'genitive-particle': AtomNode<'genitive-particle'>,
        owner: NounPhrase,
    }
}


export interface DativeComplement extends Complement<'dative-complement'> {
    readonly links: {
        'dative-particle': AtomNode<'dative-particle'>,
        owner: NounPhrase,
    }
}

export interface AblativeComplement extends Complement<'ablative-complement'> {
    readonly links: {
        'ablative-particle': AtomNode<'ablative-particle'>,
        origin: NounPhrase,
    }
}

export interface LocativeComplement extends Complement<'locative-complement'> {
    readonly links: {
        'locative-particle': AtomNode<'locative-particle'>,
        location: NounPhrase,
    }
}

export interface InstrumentalComplement extends Complement<'instrumental-complement'> {
    readonly links: {
        'instrumental-particle': AtomNode<'instrumental-particle'>,
        instrument: NounPhrase,
    }
}

export interface ComitativeComplement extends Complement<'comitative-complement'> {
    readonly links: {
        'comitative-particle': AtomNode<'comitative-particle'>,
        companion: NounPhrase,
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
        complement?: { list: (DativeComplement | AblativeComplement | LocativeComplement | ComitativeComplement | InstrumentalComplement)[] },
    }
}

export interface Macro extends GeneralAstNode<'macro'> {
    readonly links: {
        macropart: { list: Macropart[] },
        subject: AtomNode<'noun'>,
    }
}

export interface Macropart extends GeneralAstNode<'macropart'> {
    readonly links: {
        adjective: { list: AtomNode<'adjective'>[] },
        taggedunion: { list: Taggedunion[] },
        exceptunion: Exceptunion,
    }
}

export interface Exceptunion extends GeneralAstNode<'exceptunion'> {
    readonly links: {
        taggedunion: { list: Taggedunion[] },
    }
}

export interface Taggedunion extends GeneralAstNode<'taggedunion'> {
    readonly links: {
        noun: AtomNode<'noun'>
    }
}

export interface ComplexSentence extends GeneralAstNode<'complex-sentence'> {
    readonly links: {
        condition: CopulaSentence | VerbSentence,
        consequence: CopulaSentence | VerbSentence,
        subconj: AtomNode<'subconj'>,
    }
}

export interface StringAst extends GeneralAstNode<'string'> {
    readonly links: {
        'string-token': { list: AtomNode<LexemeType>[] }
    }
}

export interface NumberLiteral extends GeneralAstNode<'number-literal'> {
    readonly links: {
        'first-digit': AtomNode<'digit'>,
        'digit': { list: AtomNode<'digit'>[] }
    }
}


export type Role = 'subject'
    | 'object'
    | 'predicate'
    | 'condition'
    | 'consequence'
    | 'owner'
    | 'operator'
