import pl from 'tau-prolog'
import Article from './ast/tokens/Article';
import Copula from './ast/tokens/Copula';
import Noun from './ast/tokens/Noun';
import { getLexer } from './lexer/Lexer';
import { getParser } from './parser/Parser';
const session  = pl.create()
session.consult('capra(webpack). ');

(window as any).session = session;

//////////////////////////////////////////////////////////////
// console.log((tokenOf('a') as Article).isDefinite())
// console.log(tokenOf('a')  instanceof Article)
// console.log(tokenOf('a')  instanceof Quantifier)
// console.log(tokenOf('every')  instanceof Quantifier)
// console.log(tokenOf('a').toString())
//////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////
// const lexer = getLexer('the cat is a cat.')
// console.log(lexer)
// console.log('is it a noun?', lexer.assert(Noun, {errorOut:false}) )
// console.log(lexer.peek)
// console.log('is it a copula?', lexer.assert(Copula, {errorOut:false}) )
// console.log(lexer.peek)
// console.log('is it an article?', lexer.assert(Article, {errorOut:false}) )
// console.log(lexer.peek)
///////////////////////////////////////////////////////

const parser = getParser('the cat is big')
console.log(parser)
const ast = parser.parse()
console.log(ast)



