// import { $ } from "./exp-builder.ts";
// import { expand } from "./getAnaphora.ts";
// import { Anaphor, DerivationClause, LLangAst, isAnaphor } from "./types.ts";

// export function removeAnaphorsFrom(ast: DerivationClause) {
//     // if (ast.conseq.type === 'has-formula') {
//     //     const t1 = ast.conseq.t1.type === 'anaphor' ? expand(ast.conseq.t1) : ast.conseq
//     //     console.log(t1)
//     //     const t2 = ast.conseq.t2.type === 'anaphor' ? expand(ast.conseq.t2) : ast.conseq
//     //     const as = ast.conseq.as.type === 'anaphor' ? expand(ast.conseq.as) : ast.conseq

//     // }
//     // console.log(Object.values(ast))
//     // const x = Object.values(ast).filter(isAnaphor).map(x => expand(x))
//     // console.log(x)

//     const x = Object.values(ast.conseq).filter(isAnaphor).map(expand)
//     console.log(x)
//     const y = Object.values(ast.when).filter(isAnaphor).map(expand)
//     console.log(y)

// }

// // a cat does eat a mouse when the cat has the mouse as food.
// // x:cat does eat y:mouse when x:cat has y:mouse as food.

// // a cat whose fur has red as color does eat a mouse when the cat has the mouse as food.

// const x = $({ subject: $.a('cat').whose($('fur').has('red').as('color')).$, verb: 'eat', object: $.a('mouse').$ })
//     .when($.the('cat').has($.the('mouse')).as('food')).$

// // console.log(x)
// removeAnaphorsFrom(x)






