// // import { getParser } from "./Parser";
// import { getParser } from "../parser/Parser";
// import { toClause } from "../parser/toClause";

// export default async function testNewXParser() {

//     const asts = getParser('every cat is red. a cat is green. color of button is red. color of any button is red. color of any button is background of style of button').parseAll()

//     for (const ast of asts) {

//         if (ast) {
//             const clause = await toClause(ast)
//             console.log(clause.toString())
//         }
//     }

// }
