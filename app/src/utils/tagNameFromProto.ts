
/**
 * Try getting the name of an html element from a prototype
 */
export const tagNameFromProto = (x: object) => x.constructor.name
    .replace('HTML', '')
    .replace('Element', '')
    .toLowerCase()
