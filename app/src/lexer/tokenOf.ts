import indefinite_articles from '../../res/indefinite_articles'
import definite_articles from '../../res/definite_articles'
import copulas from '../../res/copulas'
import hverbs from '../../res/hverbs'
import iverbs from '../../res/iverbs'
import mverbs from '../../res/mverbs'
import negations from '../../res/negations'
import nonsubconj from '../../res/nonsubconj'
import prepositions from '../../res/prepositions'
import quantifiers from '../../res/quantifiers'
import relprons from '../../res/relprons'
import subconj from '../../res/subconj'
import then from '../../res/then'
import Article from '../ast/tokens/Article'
import Copula from '../ast/tokens/Copula'
import HVerb from '../ast/tokens/HVerb'
import IVerb from '../ast/tokens/IVerb'
import MVerb from '../ast/tokens/MVerb'
import Negation from '../ast/tokens/Negation'
import NonSubordinatingConjunction from '../ast/tokens/NonSubordinatingConjunction'
import Preposition from '../ast/tokens/Preposition'

export default function tokenOf(string:string){
    
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
    }

}