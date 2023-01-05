import { getConcepts, getIsName } from "./getConcepts"

/**
 * Corresponds to prop(object)
 */
export function is(object: any, prop: any, ...args: any[]) {

    const objectConcepts = getConcepts(object)
    const propConcepts = getConcepts(prop)

    const matchingConcepts = propConcepts
        .filter(x => objectConcepts.includes(x))

    return matchingConcepts
        .some(x => object[getIsName(x)].bind(object)(prop))

}