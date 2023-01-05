import { getGetterName } from "./getConcepts"


export function get(object: any, concept: string) {

    return object[getGetterName(concept)].bind(object)()
}