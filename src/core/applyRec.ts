// import { $ } from "./exp-builder.ts";
// import { LLangAst } from "./types.ts";

import { Equality, LLangAst } from "./types.ts";

// export function applyRec(ast: LLangAst, fn: (x: LLangAst) => boolean): unknown {
//     switch (ast.type) {
//         case "string":
//         case "number":
//         case "boolean":
//         case "entity":
//         case "variable":
//             // return [applyRec(ast, fn)]
//             return []
//         case "list-pattern":
//             return [applyRec(ast.seq, fn), applyRec(ast.value, fn)]
//         case "list-literal":
//             return ast.value.map(x => applyRec(x, fn))
//         case "is-a-formula":
//             return [applyRec(ast.t1, fn), applyRec(ast.t2, fn), applyRec(ast.after, fn)]
//         case "has-formula":
//             return [applyRec(ast.t1, fn), applyRec(ast.t2, fn), applyRec(ast.as, fn), applyRec(ast.after, fn)]
//         case "equality":
//             return [applyRec(ast.t1, fn), applyRec(ast.t2, fn)]
//         case "generalized":
//             return [...Object.values(ast.keys).map(x => applyRec(x, fn)), applyRec(ast.after, fn)]
//         case "happen-sentence":
//             return [applyRec(ast.event, fn)]
//         case "conjunction":
//         case "disjunction":
//             return [applyRec(ast.f1, fn), applyRec(ast.f2, fn)]
//         case "negation":
//             return [applyRec(ast.f1, fn)]
//         case "existquant":
//             return [applyRec(ast.variable, fn), applyRec(ast.where, fn)]
//         case "derived-prop":
//             return [applyRec(ast.conseq, fn), applyRec(ast.when, fn)]
//         case "if-else":
//             return [applyRec(ast.condition, fn), applyRec(ast.otherwise, fn), applyRec(ast.then, fn)]
//         case "math-expression":
//             return [applyRec(ast.left, fn), applyRec(ast.right, fn)]
//         case "anaphor":
//             return [applyRec(ast.description, fn), applyRec(ast.head, fn)]
//         case "command":
//         case "question":
//             return [applyRec(ast.f1, fn)]
//     }
// }

// console.log(applyRec($('x:number').plus(2).equals(1).$, x => x.type === 'variable'))


export function findEquations(ast: LLangAst): Equality[] {
    switch (ast.type) {
        case "string":
        case "number":
        case "boolean":
        case "entity":
        case "variable":
        case "list-pattern":
        case "list-literal":
        case "is-a-formula":
        case "has-formula":
        case "happen-sentence":
            return []
        case "equality":
            if (ast.t1.type === 'math-expression' || ast.t2.type === 'math-expression') return [ast]
            return []
        case "conjunction":
        case "disjunction":
            return [...findEquations(ast.f1), ...findEquations(ast.f2)]
        case "negation":
            return findEquations(ast.f1)
        case "existquant":
            return findEquations(ast.where)
        case "derived-prop":
            return [...findEquations(ast.conseq), ...findEquations(ast.when)]
        case "if-else":
            return [...findEquations(ast.condition), ...findEquations(ast.otherwise), ...findEquations(ast.then)]
        case "math-expression":
            return []
        case "anaphor":
            return findEquations(ast.description)
        case "generalized":
    }

    // throw new Error('not implemented!')
    return []
}
