import { match } from "./match.ts";
import { KnowledgeBase, LLangAst } from "./types.ts";

/**
 * Returns +ve if astOne is more specific than astTwo, -ve if the 
 * opposite is true, 0 if astOne and astTwo are equivalent or unrelated.
 */
function compareSpecificities(astOne: LLangAst, astTwo: LLangAst, kb: KnowledgeBase) {
    const twoMoreSpec = match(astOne, astTwo, kb)
    const oneMoreSpec = match(astTwo, astOne, kb)

    if (oneMoreSpec && !twoMoreSpec) return 1
    if (twoMoreSpec && !oneMoreSpec) return -1

    return 0 // unrelated or equivalent, no difference
}

// import { $ } from "./exp-builder.ts";
// const x = compareSpecificities(
//     $.the('cat').is('hungry').$,
//     $.the('cat').which($._.is('white')).is('hungry').$,
//     $.emptyKb,
// )
// console.log(x)



