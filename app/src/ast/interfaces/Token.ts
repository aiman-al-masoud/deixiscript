import { Lexeme } from "../../lexer/Lexeme";
import { Constructor } from "../../lexer/Lexer";
import Adjective from "../tokens/Adjective";
import Article from "../tokens/Article";
import Copula from "../tokens/Copula";
import FullStop from "../tokens/FullStop";
import HVerb from "../tokens/HVerb";
import IVerb from "../tokens/IVerb";
import MVerb from "../tokens/MVerb";
import Negation from "../tokens/Negation";
import NonSubordinatingConjunction from "../tokens/NonSubordinatingConjunction";
import Noun from "../tokens/Noun";
import Preposition from "../tokens/Preposition";
import Quantifier from "../tokens/Quantifier";
import RelativePronoun from "../tokens/RelativePronoun";
import SubordinatingConjunction from "../tokens/SubordinatingConjunction";
import Then from "../tokens/Then";
import Ast from "./Ast";
import { LexemeType } from "./LexemeType";

export default interface Token extends Ast {
    readonly lexeme: Lexeme
}

export function getTokenCons(lexeme: Lexeme): Token {
    return new constructors[lexeme.type](lexeme)
}

const constructors: { [x in LexemeType]: Constructor<Token> } = {
    'noun': Noun,
    'iverb': IVerb,
    'mverb': MVerb,
    'hverb': HVerb,
    'copula': Copula,
    'then': Then,
    'adj': Adjective,
    'existquant': Quantifier, //
    'uniquant': Quantifier,
    'preposition': Preposition,
    'subconj': SubordinatingConjunction,
    'relpron': RelativePronoun,
    'defart': Article, //
    'indefart': Article,
    'fullstop': FullStop,
    'nonsubconj': NonSubordinatingConjunction,
    'negation': Negation,
    'contraction': Negation //TODO: fix this crap  
}