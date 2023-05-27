import { Conjunction, LLangAst } from "../machines-like-us/types.ts";
import { ast_node } from "./ast-types.ts";
import { copulaToHas } from "./copulaToHas.ts";
import { expandModifiers } from "./expandModifiers.ts";
import { parse } from "./parse.ts";
import { wm } from './example-world-model.ts'
import { $, ExpBuilder } from "../machines-like-us/exp-builder.ts";


function convert(ast: ast_node): ExpBuilder<LLangAst> {

    switch (ast.type) {
        case 'noun-phrase':

            if (ast.modifiers) throw new Error('noun phrase has modifiers!')
            if (ast.owner !== undefined) throw new Error('noun phrase has owner!')

            {
                let query: ExpBuilder<LLangAst> = $('x:thing').isa(ast.head)

                if (ast.suchThat) {
                    query = query.and(convert(ast.suchThat) as ExpBuilder<Conjunction>)
                }

                return query
            }

        case 'has-sentence':
            return $('x:thing').has(ast.object.head).as(ast.role.head)

    }
    
    throw new Error('not implemented!')
}


const ast = copulaToHas(expandModifiers(parse('the red button')), wm)
console.log(convert(ast))