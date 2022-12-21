import pl from 'tau-prolog'
import CopulaQuestion from './ast/sentences/CopulaQuestion';
import Article from './ast/tokens/Article';
import Copula from './ast/tokens/Copula';
import Noun from './ast/tokens/Noun';
import { getBrain } from './brain/Brain';
import { BasicClause } from './clauses/BasicClause';
import { clauseOf } from './clauses/Clause';
import { getLexer } from './lexer/Lexer';
import { getParser } from './parser/Parser';
import Prolog, { getProlog } from './prolog/Prolog';
import TauProlog from './prolog/TauProlog';


// PROLOG TEST //////////////////////////////////////////
// const pro = getProlog();
// (window as any).pro = pro;
// (async () => {
//     await pro.assert('capra(scemo)')
//     await pro.assert('mammal(peloso)')
//     await pro.assert('mammal(fido)')
//     await pro.assert('mammal(X) :- capra(X)')
//     console.log(await pro.query('mammal(X).'))
//     await pro.retract('capra(scemo)')
//     console.log(await pro.query('mammal(X).'))
// })();
// //      //////////////////////////////////////////


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
// console.log((window as any).ast = getParser('the color of the button is red').parse())
// console.log((window as any).ast = getParser('the color of the button on the black div is red').parse())

// COMPILER TESTS
function test(string: string) {
    console.log(string)
    const clause = getParser(string).parse().toProlog().copy({ map: { 'id1': 1000, 'id2': 2000 } })
    console.log(clause.flatList().map(c => c.toString()))
    console.log(clause)
    console.log('entities', clause.entities)
    console.log('theme', clause.theme)
    console.log('rheme', clause.rheme)
    console.log(clause.about('id0'))
}

// test('the cat is on the mat')
// test('the cat that is red is on the mat')
// test('the big cat that is on the mat is black')
// test('every cat is red')
// test('every red cat is on the mat')
// test('the cat exists on the mat')
// test('if the cat is on the mat then the cat is red')
// test('the cat is not red')
// test('every cat is not red')
// test('trump is not a great president'); // probably need an and predicate

// END COMPILER TESTS


// (async () => {
//     const brain = await getBrain();
//     const c = clauseOf('capra', 'uno')
//         .concat(clauseOf('capra', 2))
//         .concat(clauseOf('capra', 3))
//         .concat(clauseOf('white', 3))
//         .concat(clauseOf('cat', 4))
//         .concat(clauseOf('white', 4))

//     await brain.assert(c);
//     console.log(await brain.query(clauseOf('white', 'X').concat(clauseOf('cat', 'X'))))
// })()

(async () => {

    const brain = await getBrain()

    const p = document.createElement('p')
    document.getElementById('root')?.appendChild(p)

    const textarea = document.createElement('textarea')
    document.getElementById('root')?.appendChild(textarea)

    textarea.oninput = e => {

        const text = textarea.value
        const ast = getParser(text).parse()
        const clause = ast.toProlog()

        p.innerHTML = `${(ast as any).constructor.name}: ${clause.toString()}`
    }

})();
