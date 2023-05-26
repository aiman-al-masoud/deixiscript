// import { getParser } from '../parser/parser.ts'
// import { AstNode } from '../parser/types.ts'
// import { ast_node, noun_phrase } from './ast-types.ts'
// import { syntaxes } from './grammar.ts'

// import { $, ExpBuilder } from '../machines-like-us/exp-builder.ts'
// import { Ast, WorldModel } from '../machines-like-us/types.ts'
// // import { getParts } from '../machines-like-us/wm-funcs.ts'
// import { findAll } from '../machines-like-us/findAll.ts'


// export function parse(sourceCode: string): ast_node[] {

//     const results: AstNode[] = []

//     sourceCode.split('.').map(x => x.trim()).forEach(s => {
//         const ast = getParser(s, syntaxes).parse()
//         if (ast) {
//             results.push(ast)
//         }
//     })

//     return results as any
// }


// const res = parse(`
//     the cat's fur is green. 
//     the cat is big.
//     the cat is a smart cat.
//     if the cat is black then the dog is stupid.
//     `)

// const wm: WorldModel = [
//     ['cat#33', 'cat'],
//     ['cat#44', 'cat'],
//     ['cat#44', 'red'],
//     ['dog#22', 'dog'],
// ]


// function findEntity(np: noun_phrase, wm: WorldModel) {

//     const v = $(`x:${np.head}`)
//     let query: ExpBuilder<Ast> = v.isa(np.head)

//     np.modifiers?.forEach(m => {
//         query = query.and(v.isa(m))
//     })

//     const results = findAll(query.$, [v.$], { wm, derivClauses: [] })
//     return results

// }

// console.log(findEntity(parse('the red cat')[0] as noun_phrase, wm))


// // function updateEntities(ast: ast_node, wm: WorldModel): [WorldModel, ast_node] {

// //     switch (ast.type) {
// //         case 'noun-phrase':

// //             // search for it in wm
// //             {
// //                 const v = $(`x:${ast.head}`)
// //                 let query: ExpBuilder<Ast> = v.isa(ast.head)

// //                 ast.modifiers?.forEach(m => {
// //                     query = query.and(v.isa(m))
// //                 })

// //                 const results = findAll(query.$, [v.$], { wm, derivClauses: [] })


// //             }

// //             // if single result present, return old wm with updated ast

// //             // if multiple results, raise error

// //             // if not present, create new entity

// //             return
// //         case 'if-sentence':
// //         // return updateEntities(ast.condition, wm).concat(updateEntities(ast.consequence, wm))
// //         case 'copula-sentence':
// //         // return updateEntities(ast.subject, wm).concat(updateEntities(ast.object, wm))
// //         case 'number-literal':
// //         // return wm
// //     }

// // }

