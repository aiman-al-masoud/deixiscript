import { SyntaxMap } from "../parser/types.ts";
import { ast_node } from "./deixi-ast.ts";
import { syntaxes } from "./grammar.ts";
import { parse } from "./parse.ts";

function verbalize(ast: ast_node, /* syntaxes?: SyntaxMap=undefined */): string {

    switch (ast.type) {
        case 'noun-phrase':
            if (ast.suchThat) return `( ${ast.head} such that ${verbalize(ast.suchThat!)} )`
            // if (ast.modifiers) return 
            return '(' + ast.head + ')'
        case 'copula-sentence':
            return `( ${verbalize(ast.subject)} is ${verbalize(ast.object)} )`
        case 'there-is-sentence':
            break
        case 'has-sentence':
            return `( ${verbalize(ast.subject)} has ${verbalize(ast.object)} as ${verbalize(ast.role)} )`
        case 'and-sentence':
            break
        case 'comparative-sentence':
            return `(${verbalize(ast.subject)} is more ${ast.comparison} than ${verbalize(ast.object)})`
    }

    throw new Error('not implemented!')
}


console.log(verbalize(parse('the button is more beautiful than the door')))


