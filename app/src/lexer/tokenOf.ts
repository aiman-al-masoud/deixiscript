import Article from '../ast/tokens/Article'
import Copula from '../ast/tokens/Copula'
import HVerb from '../ast/tokens/HVerb'
import IVerb from '../ast/tokens/IVerb'
import MVerb from '../ast/tokens/MVerb'
import Negation from '../ast/tokens/Negation'
import NonSubordinatingConjunction from '../ast/tokens/NonSubordinatingConjunction'
import Preposition from '../ast/tokens/Preposition'
import Quantifier from '../ast/tokens/Quantifier'
import Then from '../ast/tokens/Then'
import RelativePronoun from '../ast/tokens/RelativePronoun'
import SubordinatingConjunction from '../ast/tokens/SubordinatingConjunction'
import Noun from '../ast/tokens/Noun'
import Adjective from '../ast/tokens/Adjective'
import Token from '../ast/interfaces/Token'
import FullStop from '../ast/tokens/FullStop'
import { getLexemes } from './Lexeme'
import { Constructor } from './Lexer'

export default function tokenOf(string: string): Token[] {

    const constructors: { [x: string]: Constructor<Token> } = {
        'noun': Noun,
        'iverb': IVerb,
        'mverb': MVerb,
        'hverb': HVerb,
        'copula': Copula,
        'then': Then,
        'adj': Adjective,
        'existquant': Quantifier,
        'uniquant': Quantifier,
        'preposition': Preposition,
        'subconj': SubordinatingConjunction,
        'relpron': RelativePronoun,
        'defart': Article,
        'indefart': Article,
        'fullstop': FullStop,
        'nonsubconj': NonSubordinatingConjunction,
        'negation': Negation
    }

    return getLexemes(string).map(l => new constructors[l.type](l.name))
}