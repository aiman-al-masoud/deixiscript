import pl from 'tau-prolog'
import Article from './ast/tokens/Article';
import tokenOf from './lexer/tokenOf';
const session  = pl.create()
session.consult('capra(webpack). ');

(window as any).session = session;


console.log((tokenOf('a') as Article).isDefinite())

