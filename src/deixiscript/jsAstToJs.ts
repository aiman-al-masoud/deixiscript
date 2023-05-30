import { JsAst } from "./js-ast.ts";

export function jsAstToJs(jsAst: JsAst): string {
    switch (jsAst.type) {
        case 'variable-declaration':
            return `let ${jsAst.name} = ${jsAstToJs(jsAst.rval)};`
        case 'constructor-call':
            return `new ${jsAst.name}()`
        case 'function-call':
            return `${jsAst.name}(${jsAst.arguments})`
        case 'method-call':
            // @ts-ignore
            return `${jsAst.variable}.${jsAst.name}({receiver:${jsAst.arguments['receiver'].name}})`

    }

    throw new Error('not implemented!')
}