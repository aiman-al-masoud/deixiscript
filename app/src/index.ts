import pl from 'tau-prolog'
import Article from './ast/tokens/Article';
import Quantifier from './ast/tokens/Quantifier';
import tokenOf from './lexer/tokenOf';
const session  = pl.create()
session.consult('capra(webpack). ');

(window as any).session = session;


console.log((tokenOf('a') as Article).isDefinite())

console.log(tokenOf('a')  instanceof Article)
console.log(tokenOf('a')  instanceof Quantifier)
console.log(tokenOf('every')  instanceof Quantifier)
console.log(tokenOf('a').toString())
