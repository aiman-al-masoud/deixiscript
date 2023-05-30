import { ast_node } from "./deixi-ast.ts";
import { JsAst } from "./js-ast.ts";

export function deixiToJs(deixi: ast_node): JsAst {

    switch (deixi.type) {
        case 'there-is-sentence':
            return {
                type: 'variable-declaration',
                rval: {
                    type: 'constructor-call',
                    name: deixi.subject.head,
                    arguments: [],
                },
                name: deixi.subject.head
            }
        case 'verb-sentence':
            return {
                type: 'method-call',
                variable: deixi.subject.head,
                name: deixi.verb,
                arguments: { receiver: { type: 'variable', name: deixi.receiver?.head! } }
            }
        case 'copula-sentence':
            return {
                type: 'variable-declaration',
                name: deixi.subject.head,
                rval: {
                    type: 'constructor-call',
                    name: deixi.object.head,
                    arguments: [],
                }
            }
    }

    throw new Error('errror!')
}
