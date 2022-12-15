import pl from 'tau-prolog'
import Article from './ast/tokens/Article';
import Copula from './ast/tokens/Copula';
import Noun from './ast/tokens/Noun';
import { getLexer } from './lexer/Lexer';
import { getParser } from './parser/Parser';
import Prolog, { getProlog } from './prolog/Prolog';
import TauProlog from './prolog/TauProlog';
// const session  = pl.create()
// session.consult('capra(webpack). ');

// session.query('assertz( pressed(button) ).');
// session.answer(a=>{});
// console.log(session.rules)
// session.query('retract( pressed(button) ). ')
// session.answer(a=>{});;
// console.log(session.rules);


// (window as any).session = session;


// PROLOG TEST //////////////////////////////////////////
const pro = getProlog();
(window as any).pro = pro;

(async () => {
    await pro.assert('capra(scemo)')
    await pro.assert('mammal(peloso)')
    await pro.assert('mammal(fido)')
    await pro.assert('mammal(X) :- capra(X)')
    console.log(await pro.query('mammal(X).'))
    await pro.retract('capra(scemo)')
    console.log(await pro.query('mammal(X).'))
})();
//      //////////////////////////////////////////



// pro.retract('capra(scemo)')
// pro.query('mammal(X).').then(a=> console.log(a))

// pro.assert('mammal(X) :- cat(X)')
// pro.assert('cat(luna)')
// pro.query('mammal(X).').then(a=> console.log(a))


// pro.assert('mammal(X) :- cat(X)')
// pro.assert('cat(gattino)')
// pro.query('cat(gattino)').then(a=> console.log(a))



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


// console.log(getParser('the cat is big').parse())
// console.log(getParser('the big cat').parse() )
// console.log(getParser('the big cat on the table is eating tuna').parse() )
// console.log(getParser('the big cat on the mat').parse() )
// console.log(getParser('every dog is stupid').parse() )
// console.log(getParser('the cat that is smart').parse() )
// console.log(getParser('nodejs is not helpful').parse() )
// console.log(getParser('if the dog is stupid then the cat is happy').parse() )
// console.log(getParser('the cat is happy if the dog is stupid').parse() )
