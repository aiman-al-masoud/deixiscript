import { getIsName, getSetterName } from "./getConcepts"

export function setConcept(
    object: any,
    concept: string,
    setter: (...args: any) => void,
    is: (...args: any) => boolean) {

    Object.defineProperty(object, getSetterName(concept), { value: setter })
    Object.defineProperty(object, getIsName(concept), { value: is })

}