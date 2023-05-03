// import main from "./src/main/main";
import { getCharStream } from "./src/new-frontend/char-stream";
import { AstType, syntaxes } from "./src/new-frontend/csts";
import { maxPrecedence } from "./src/new-frontend/max-precedence";
import { getParser } from "./src/new-frontend/parser";
// import { parseSyntax, parseTry } from "./src/new-frontend/parser";

// main()



// // EXAMPLE 0 
// const cs0 = getCharStream('12    mondo ')
// const x0 = parseTry(['number-literal'], cs0)
// const y0 = parseTry(['space'], cs0)
// const z0 = parseTry(['identifier'], cs0)
// console.log(0, x0, y0, z0)
// // EXAMPLE 1
// const cs = getCharStream('12    mondo ')
// const x = parseTry(['number-literal'], cs)
// console.log(1, x)
// // EXAMPLE 2
// const cs2 = getCharStream('do  make ')
// const x2 = parseTry(['do-verb'], cs2)
// console.log(2, x2)
// // EXAMPLE 3
// const cs3 = getCharStream('" ciao "xxx')
// const x3 = parseTry(['string-literal'], cs3)
// console.log(3, x3)
// // EXAMPLE 4
// const cs4 = getCharStream('ciao mondo buruf')
// const x4 = parseSyntax([{ types: ['identifier'], sep: 'space', number: 'all-but-last', role: 'anything' as any }], cs4)
// const x40 = parseTry(['identifier'], cs4)
// console.log(4, x4, x40)
// // EXAMPLE 5
// const cs5 = getCharStream('does not make ') // does not make // is not
// const x5 = parseTry(['verb'], cs5)
// console.log(5, x5)


// const parser = getParser('121', syntaxes)
// console.log(parser.parse())

// const syntaxList = Object.keys(syntaxes) as AstType[]
// syntaxList.sort((a, b) => maxPrecedence(b, a, syntaxes))
// console.log(syntaxList)

// ---------------------------
// const x = getParser('bad blue bird', syntaxes).parse()
// console.log(x)

// const x1 = getParser('every bad blue bird', syntaxes).parse()
// console.log(x1)

// const x2 = getParser('bad blue birds', syntaxes).parse() //PROBLEM!
// console.log(x2)

// const x3 = getParser('bad blue bird of the x ', syntaxes).parse() //PROBLEM!
// console.log(x3)

// const x1 = getParser('x of y', syntaxes).parseTry(['noun-phrase'])
// console.log(x1)

// console.log(x1)


// const x1 = getParser('bad buruf of house of me', syntaxes).parse()
// const x2 = getParser('bad person', syntaxes).parse()
// const x3 = getParser('every x is capra by y', syntaxes).parseTry(['simple-sentence'])

// console.log(x1)
// console.log(x2)
// console.log(x3)


const x4 = getParser('capras are buruf', syntaxes).parse()
console.log(x4)