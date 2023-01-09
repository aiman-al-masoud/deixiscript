export const setterPrefix = 'set'
export const isPrefix = 'is'
export const getterPrefix = 'get'

export function getConcepts(object: any): string[] {

    // TODO: try getting a concept from a string object with a 
    // special dictionary, like {red:color, green:color, blue:color}
    const stringConcepts: { [x: string]: string } = {
        'green': 'color',
        'red': 'color',
        'blue': 'color',
        'black': 'color',
        'big': 'size'
    }
    const maybeConcept: string | undefined = stringConcepts[object.toString()]

    if (maybeConcept) {
        return [maybeConcept]
    }

    return Object
        .getOwnPropertyNames(object)
        .concat(Object.getOwnPropertyNames(object.__proto__))
        .filter(x => x.includes(setterPrefix) || x.includes(isPrefix))
        .map(x => getConceptName(x))

}

export function getSetterName(concept: string) {
    return `${setterPrefix}_${concept}`
}

export function getIsName(concept: string) {
    return `${isPrefix}_${concept}`
}

export function getGetterName(concept: string) {
    return `${getterPrefix}_${concept}`
}

export function getConceptName(method: string) {
    return method
        .replace(isPrefix, '')
        .replace(setterPrefix, '')
        .replace(getterPrefix, '')
        .replace('_', '')
}
