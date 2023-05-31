// import { LLangAst } from "./types.ts"


// export function formulasEqual(f1: LLangAst, f2: LLangAst): boolean {

//     // console.log(f1.type, f2.type)


//     if (f1.type === 'list-literal' && f2.type === 'list-pattern') {
//         return f1.list.length >= 2
//     } else if (f2.type === 'list-literal' && f1.type === 'list-pattern') {
//         return f2.list.length >= 2
//     } else if (f1.type === 'conjunction' && f2.type === 'conjunction') {
//         return formulasEqual(f1.f1, f2.f1) && formulasEqual(f1.f2, f2.f2)
//     } else if (f1.type === 'disjunction' && f2.type === 'disjunction') {
//         return formulasEqual(f1.f1, f2.f1) && formulasEqual(f1.f2, f2.f2)
//     } else if (f1.type === 'negation' && f2.type === 'negation') {
//         return formulasEqual(f1.f1, f2.f1)
//     } else if (f1.type === 'equality' && f2.type === 'equality') {
//         return formulasEqual(f1.t1, f2.t1) && formulasEqual(f1.t2, f2.t2)
//     } else if (f1.type === 'is-a-formula' && f2.type === 'is-a-formula') {
//         return formulasEqual(f1.t1, f2.t1) && formulasEqual(f1.t2, f2.t2) && formulasEqual(f1.after, f2.after)
//     } else if (f1.type === 'if-else' && f2.type === 'if-else') {
//         return formulasEqual(f1.condition, f2.condition) && formulasEqual(f1.otherwise, f2.otherwise) && formulasEqual(f1.then, f2.then)
//     } else if (f1.type === 'existquant' && f2.type === 'existquant') {
//         return formulasEqual(f1.variable, f2.variable) && formulasEqual(f1.where, f2.where)
//     } else if (f1.type === 'has-formula' && f2.type === 'has-formula') {
//         return formulasEqual(f1.t1, f2.t2) && formulasEqual(f1.t2, f2.t2) && formulasEqual(f1.as, f1.as) && formulasEqual(f1.after, f2.after)
//     } else if (f1.type === 'derived-prop' && f2.type === 'derived-prop') {
//         return formulasEqual(f1.conseq, f2.conseq) && formulasEqual(f1.when, f2.when)
//     } else if (f1.type === 'list-pattern' && f2.type === 'list-pattern') {
//         return formulasEqual(f1.seq, f2.seq) && formulasEqual(f1.tail, f2.tail)
//     } else if (f1.type === 'list-literal' && f2.type === 'list-literal') {
//         return f1.list.length === f2.list.length && f1.list.every((x, i) => formulasEqual(x, f2.list[i]))
//     } else if (f1.type === 'boolean' && f2.type === 'boolean') {
//         return f1.value === f2.value
//     } else if (f1.type === 'variable' && f2.type === 'variable') {
//         return f1.name === f2.name && f1.varType === f2.varType
//     } else if (f1.type === 'constant' && f2.type === 'constant') {
//         return f1.value === f2.value
//     }

//     return false
//     // throw new Error('not implemented!' + f1.type+' '+ f2.type)
//     // return JSON.stringify(f1) === JSON.stringify(f2)
// }