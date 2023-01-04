import { getGetterName, getSetterName } from "./getConcepts"

export function setConcept(
    object: any,
    concept: string,
    setter: (...args: any) => void,
    getter: (...args: any) => boolean) {

    Object.defineProperty(object, getSetterName(concept), { value: setter })
    Object.defineProperty(object, getGetterName(concept), { value: getter })

}