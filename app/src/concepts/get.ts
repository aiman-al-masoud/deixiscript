import { getConcepts, getGetterName, getIsName } from "./getConcepts"


export function get(object: any, concept: string) {

    // const objectConcepts = getConcepts(object)
    // const propConcepts = getConcepts(prop)

    // const matchingConcepts = propConcepts
    //     .filter(x => objectConcepts.includes(x))

    // return matchingConcepts
    //     .some(x => object[getIsName(x)].bind(object)(prop))

    return object[getGetterName(concept)].bind(object)()
}