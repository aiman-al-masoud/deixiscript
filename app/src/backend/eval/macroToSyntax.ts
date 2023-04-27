// import { Macro, Macropart } from "../../frontend/parser/interfaces/AstNode"
// import { Member, AstType } from "../../frontend/parser/interfaces/Syntax"

// export function macroToSyntax(macro: Macro) {

//     const macroparts = macro.macropart.list ?? []
//     const syntax = macroparts.map(m => macroPartToMember(m))
//     const name = macro.subject.lexeme.root

//     if (!name) {
//         throw new Error('Anonymous syntax!')
//     }

//     return { name, syntax }
// }

// function macroPartToMember(macroPart: Macropart): Member {

//     const taggedUnions = macroPart?.taggedunion?.list ?? []
//     const grammars = taggedUnions.map(x => x?.noun)

//     const exceptUnions = macroPart?.exceptunion?.taggedunion?.list ?? []
//     const notGrammars = exceptUnions.map(x => x?.noun)

//     return {
//         types: grammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
//         role: macroPart["grammar-role"]?.lexeme?.root,
//         number: macroPart.cardinality?.lexeme?.cardinality,
//         exceptTypes: notGrammars.flatMap(g => (g?.lexeme?.root as AstType) ?? []),
//     }

// }
