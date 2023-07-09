/**
 * ******************************************
 * AN EXPERIMENT
 * ******************************************
 */


// import { $ } from "./exp-builder.ts"
// import { Anaphor } from "./types.ts"

// type Ast = {
//     [x: string]: Ast | Ast[] | string | number | boolean | string[] | number[] | boolean[]
// } & {
//     type?: string
// }

// function transform(ast: Ast, fn: (ast: Ast) => Ast): Ast {

//     if (typeof ast !== 'object' || ast instanceof Array) return ast

//     const entries = Object.entries(ast)

//     const newEntries = entries.map(x => [x[0], transform(fn(x[1] as Ast), fn)])
//     const ast2 = Object.fromEntries(newEntries)
//     return fn(ast2)
//     // return ast2

// }


// // const x = transform(
// //     $('x:capra').suchThat().has('black').as('color').$,
// //     ast => {
// //         if (ast.type === 'entity') {
// //             return { ...ast, type: 'myentitttuiihhh' }
// //         }
// //         if (ast.type === 'anaphor') {
// //             return { ...ast, crap: 1121 }
// //         }
// //         return ast
// //     })
// // console.log(x)


// const y = transform(
//     {
//         type: 'noun-phrase',
//         head: 'capra',
//         whose: {
//             type: 'whose-clause',
//             head: 'color',
//             predicate: {
//                 verb: 'be',
//                 object: 'red',
//             }
//         }
//     },

//     function v(ast) {

//         if (ast.type === 'noun-phrase' && ast['whose']) {

//             return {
//                 type: 'anaphor',
//                 variable: 'x:' + ast.head,
//                 description: $('x:' + ast.head).has(ast.whose.head).and(v(ast.whose)).$

//             }
//         }

//         return ast
//     }
// )

// console.log(y)



// // const y: Ast = {
// //     type: 'ciao',
// //     keys: {
// //         type: 'capra',
// //         f1: { type: 'x', value: 'sdsk' },
// //         f2: { type: 'x' }
// //     },
// //     ciao: { type: '' }
// // }

// // const x: Ast = {
// //     type: "generalized",
// //     keys: {
// //         // type :'x',
// //         x: {
// //             type: "conjunction",
// //             f1: { type: "entity", value: "capra#1" },
// //             f2: { type: "entity", value: "capra#2" }
// //         }
// //     },
// //     after: { type: "list-literal", value: [] }
// // }

// // // const wtf: Ast = {
// // //     type: 'generalized',
// // //     keys: {
// // //         type: 'capra',
// // //         f1: { type: 'x', value: 'sdsk' },
// // //         f2: { type: 'x' }
// //     },
// //     ciao: { type: '' }
// // }





