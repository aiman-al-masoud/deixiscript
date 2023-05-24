/**
 * Programmatic Semantics: a mapping between natural 
 * linguistic structures and basic programming language structures.
 * 
 * You need a general data format to configure the mapping between
 * Deixiscript (natlang-like) AST types and Intermediate (JS-like) AST types.
 * 
 * A single Deixiscript AST can translate to one or more Intermediate ASTs
 * of different types, based on component types.
 * 
 */

import { $ } from "../machines-like-us/exp-builder.ts";
import { ast_node, copula_sentence } from "./ast-types.ts";
import { IAst } from "./intermediate-ast.ts";
import { parse } from "./transpile.ts";

type DeixiAstType = ast_node['type']
type IAstType = IAst['type']

// type AstMap = {
//     source: DeixiAstType
//     target: IAst[]
// }

// const s = {} as copula_sentence

// const x: AstMap = {
//     source: 'copula-sentence',
//     target: [
//         {
//             type: 'variable-declaration',
//             name: 'source.subject#random', rval: {
//                 type: 'constructor-call',
//                 name: 'source.subject',
//                 arguments: [],
//             }
//         }
//     ]
// }

function f10(ast: copula_sentence): IAst[] {

    const varname = ast.subject.head + parseInt(Math.random() * 100 + '')

    return [
        {
            type: 'variable-declaration',
            name: varname,
            rval: {
                type: 'constructor-call',
                name: ast.object.head,
                arguments: [],
            }
        },
        ...ast.object.modifiers?.map(x => ({
            type: 'property-assignment' as const,
            name: 'attribOf(' + x + ')',
            variable: varname,
            rval: x as any
        })) ?? []
    ]
}

console.log(f10(parse('x is a red cat')[0] as copula_sentence))


function toJS(iast: IAst): string {

    if (iast.type === 'variable-declaration') {
        return `let ${iast.name} = ${toJS(iast.rval)}`
    }

    if (iast.type === 'property-assignment') {
        return `${iast.variable}.${iast.name} = ${toJS(iast.rval)}`
    }

    if (iast.type === 'constructor-call') {
        return `new ${iast.name}()`
    }

    return iast.toString()
}

// f10(parse('x is a red cat')[0] as copula_sentence).forEach(x=>console.log(toJS(x)))


// function translate(ast: ast_node, map: AstMap): IAst[] {
//     return map.target.map(x => {

//     })
// }

// console.log(translate(parse('the cat is cat')[0], x))


// const mappings: { [t in x]: AstMap[] } = {
//     'copula-sentence': [

//     ],
//     'if-sentence': [],
//     'noun-phrase': [],
//     'number-literal': []
// }
