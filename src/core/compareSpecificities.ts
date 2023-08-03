import { match } from "./match.ts";
import { KnowledgeBase, LLangAst } from "./types.ts";

/**
 * Returns +ve if astOne is more specific than astTwo, -ve if the 
 * opposite is true, 0 if astOne and astTwo are equivalent or unrelated.
 */
export function compareSpecificities(astOne: LLangAst, astTwo: LLangAst, kb: KnowledgeBase) {

    // const defOfOne = definitionOf(astOne, kb) ?? astOne
    // const defOfTwo = definitionOf(astTwo, kb) ?? astTwo

    const defOfOne = astOne
    const defOfTwo = astTwo

    const twoMoreSpec = match(defOfOne, defOfTwo, kb)
    const oneMoreSpec = match(defOfTwo, defOfOne, kb)

    if (oneMoreSpec && !twoMoreSpec) return 1
    if (twoMoreSpec && !oneMoreSpec) return -1

    return 0 // unrelated or equivalent, no difference
}