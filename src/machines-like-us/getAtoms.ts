// import { Atom, LLangAst, Term } from "./types.ts";

// export function getAtoms(ast: LLangAst): Atom[] {
//     switch (ast.type) {
//         case 'if-else':
//             return getAtoms(ast.condition).concat(getAtoms(ast.otherwise)).concat(getAtoms(ast.then))
//         case 'derived-prop':
//             return getAtoms(ast.conseq).concat(getAtoms(ast.when))
//         case 'disjunction':
//         case 'conjunction':
//             return getAtoms(ast.f1).concat(getAtoms(ast.f2))
//         case 'negation':
//             return getAtoms(ast.f1)
//         case 'has-formula':
//             return getAtoms(ast.t1).concat(getAtoms(ast.t2)).concat(getAtoms(ast.as)).concat(getAtoms(ast.after))
//         case 'is-a-formula':
//             return getAtoms(ast.t1).concat(getAtoms(ast.t2)).concat(getAtoms(ast.after))
//         case 'equality':
//             return getAtoms(ast.t1).concat(getAtoms(ast.t2))
//         case 'existquant':
//             return [ast.variable, ...getAtoms(ast.where)]
//         case 'list-literal':
//             // return ast.list.flatMap(x => getTerms(x))
//             return [ast]
//         case 'list-pattern':
//             return [ast.seq, ast.tail]
//             // return [ast]
//         case 'constant':
//         case 'variable':
//         case 'boolean':
//             return [ast]
//     }
// }

// // import { $ } from "./exp-builder.ts";
// // const x = $('x:thing').isa('y').after('s:thing|e:thing').$
// // console.log(getAtoms(x))
