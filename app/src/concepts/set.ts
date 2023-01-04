import { getConcepts, getSetterName } from "./getConcepts";

export function set(object: any, prop: any) {

    const objectConcepts = getConcepts(object)
    const propConcepts = getConcepts(prop)

    const matchingConcepts = propConcepts
        .filter(x => objectConcepts.includes(x))

    matchingConcepts.forEach(x => {
        object[getSetterName(x)].bind(object)(prop)
    })
}