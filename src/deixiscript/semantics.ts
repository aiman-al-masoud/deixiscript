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
import { parse } from "./deixis.ts";

type DeixiAstType = ast_node['type']
type IAstType = IAst['type']


function f10(ast: copula_sentence): IAst[] {

    return [
        {
            type: 'variable-declaration',
            name: ast.subject.head,
            rval: {
                type: 'constructor-call',
                name: ast.object.head,
                arguments: [],
            }
        },
        ...ast.object.modifiers?.map(x => ({
            type: 'property-assignment' as const,
            name: 'attribOf(' + x + ')',
            variable: ast.subject.head,
            rval: { type: 'string-expression' as const, value: x }
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
