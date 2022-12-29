import pl, { format_answer } from 'tau-prolog'
import NounPhrase from './ast/phrases/NounPhrase';
import CopulaQuestion from './ast/sentences/CopulaQuestion';
import Article from './ast/tokens/Article';
import Copula from './ast/tokens/Copula';
import Noun from './ast/tokens/Noun';
import { getBrain } from './brain/Brain';
import { getAnaphora } from './brain/Anaphora';
import { BasicClause } from './clauses/BasicClause';
import { clauseOf } from './clauses/Clause';
import { getLexer } from './lexer/Lexer';
import { getParser } from './parser/Parser';
import Prolog, { getProlog } from './prolog/Prolog';
import TauProlog from './prolog/TauProlog';
import compileLogicTest from './tests/compile-logic-test';
import playground from './tests/playground';
import prologPlay from './tests/prolog-playground';


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
// function test(string: string) {
//     console.log(string)
//     const clause = getParser(string).parse().toClause().copy({ map: { 'id1': 1000, 'id2': 2000 } })
//     // console.log(clause.flatList().map(c => c.toString()))
//     console.log(clause.toProlog())
//     // console.log(clause)
//     // console.log('entities', clause.entities)
//     // console.log('theme', clause.theme)
//     // console.log('rheme', clause.rheme)
//     // console.log(clause.about('id0'))
// }

// test('the cat is on the mat')
// // test('the cat that is red is on the mat')
// // test('the big cat that is on the mat is black')
// test('every cat is red')
// test('every red cat is on the mat')
// // test('the cat exists on the mat')
// test('if the cat is on the mat then the cat is red')
// // test('the cat is not red')
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

// (async () => {

//     const state = {
//         timer : setTimeout(()=>{},0),
//         brain : await getBrain(),
//         debouncingTime : 0
//     }

//     const p = document.createElement('p')
//     document.getElementById('root')?.appendChild(p)

//     const textarea = document.createElement('textarea')
//     textarea.style.height = '50vh'
//     textarea.style.width = '50vw'

//     document.getElementById('root')?.appendChild(textarea)

//     const onInput = async () => {
//         const text = textarea.value
//         const ast = getParser(text).parse()
//         const clause = ast.toProlog()

//         if (!clause){
//             return 
//         }

//         const mapping = getSandbox(clause).mapTo(state.brain)


//         p.innerHTML = `${(ast as any).constructor.name}: ${clause.toString()}`

//         if (ast instanceof CopulaQuestion){
//             console.log(await state.brain.query(clause))
//         }else{
//             console.log('asserted:', clause.toString())
//         }

//     }

//     textarea.oninput = e => {
//         clearTimeout(state.timer)
//         state.timer = setTimeout(()=>{
//             onInput()
//         }, state.debouncingTime)
//     }

// })();



// (async () => {

//     const prolog = await getBrain();
//     (window as any).prolog = prolog
//     await prolog.assert(clauseOf('cat', 'a'))
//     await prolog.assert(clauseOf('cat', 'b'))
//     await prolog.assert(clauseOf('cat', 'c'))
//     await prolog.assert(clauseOf('white', 'a'))
//     await prolog.assert(clauseOf('dog', 'd'))

//     await prolog.assert(clauseOf('eat', 'a', 'rabbit'))
//     await prolog.assert(clauseOf('eat', 'a', 'mouse'))
//     await prolog.assert(clauseOf('eat', 'a', 'birdie'))
//     await prolog.assert(clauseOf('eat', 'd', 'bone'))

//     await prolog.assert(clauseOf('table', 'tb1'))

//     // const res = await prolog.query(clauseOf('cat', 'X').concat(clauseOf('eat', 'X', 'Y').concat(clauseOf('dog', 'Z'))))
//     // const clause = clauseOf('cat', 'id0').concat(clauseOf('dog', 'id1')).concat(clauseOf('capra', 'id55')) 
//     // const clause = getParser('the cat that is black is smart').parse().toProlog()
//     const clause = getParser('the cat that is white is on the table').parse().toProlog()
//     console.log(clause.toString())

//     const res = await getSandbox(clause).mapTo(prolog)
//     console.log(res)
//     console.log(clause.rheme.copy({ map: res }).toString())

// })();


// prologPlay()
// compileLogicTest()

// const x = getParser('the cat is black').parse().toClause().toProlog({anyFactId:false})
// console.log(x)

// const y = getParser('is the cat black').parse().toClause().toProlog({anyFactId :true})
// console.log(y)

// const x = getParser('the cat is on the mat. the cat is red. the cat is black')
//         .parseAll()
//         .map(c=>c.toClause().toProlog())

// console.log(x)


// (async ()=>{
//     const map = await getAnaphora(getParser('the black cat').parse().toClause()).mapToClause(getParser('the black cat').parse().toClause())
//     console.log(map)

//     const map2 = await getAnaphora(getParser('the red cat').parse().toClause()).mapToClause(getParser('the black cat').parse().toClause())
//     console.log(map2)
// })()



playground()
