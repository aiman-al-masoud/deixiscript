import adjectives from '../../res/tokens/adjectives'
import indefinite_articles from '../../res/tokens/indefinite_articles'
import definite_articles from '../../res/tokens/definite_articles'
import copulas from '../../res/tokens/copulas'
import hverbs from '../../res/tokens/hverbs'
import iverbs from '../../res/tokens/iverbs'
import mverbs from '../../res/tokens/mverbs'
import negations from '../../res/tokens/negations'
import nonsubconj from '../../res/tokens/nonsubconj'
import nouns from '../../res/tokens/nouns'
import prepositions from '../../res/tokens/prepositions'
import existquant from '../../res/tokens/existential_quantifiers'
import uniquant from '../../res/tokens/universal_quantifiers'
import relprons from '../../res/tokens/relprons'
import subconj from '../../res/tokens/subconj'
import then from '../../res/tokens/then'
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

export default function tokenOf(string:string):Token{
    
    if (indefinite_articles.concat(definite_articles).includes(string)){
        return new Article(string)
    }else if (copulas.includes(string)){
        return new Copula(string)
    }else if (hverbs.includes(string)){
        return new HVerb(string)
    }else if (iverbs.includes(string)){
        return new IVerb(string)
    }else if (mverbs.includes(string)){
        return new MVerb(string)
    }else if (negations.includes(string)){
        return new Negation(string)
    }else if (nonsubconj.includes(string)){
        return new NonSubordinatingConjunction(string)
    }else if (prepositions.includes(string)){
        return new Preposition(string)
    }else if (existquant.concat(uniquant).includes(string)){
        return new Quantifier(string)
    }else if (then.includes(string)){
        return new Then(string)
    }else if (relprons.includes(string)){
        return new RelativePronoun(string)
    }else if (subconj.includes(string)){
        return new SubordinatingConjunction(string)
    }else if (nouns.includes(string)){
        return new Noun(string)
    }else if (adjectives.includes(string)){
        return new Adjective(string)
    }else if ('.' === string){
        return new FullStop('.')
    }

    return new Adjective(string)
}