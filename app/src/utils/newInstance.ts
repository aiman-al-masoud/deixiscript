import { tagNameFromProto } from "./tagNameFromProto"

/**
 * 
 * Create a new instance of an object (even HTMLElement) from a prototype.
 */
export function newInstance(proto: object) {

    return proto instanceof HTMLElement ?
        document.createElement(tagNameFromProto(proto)) :
        new (proto as any).constructor()

}
