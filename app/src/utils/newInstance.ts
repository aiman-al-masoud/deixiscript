import { tagNameFromProto } from "./tagNameFromProto"

/**
 * 
 * Create a new instance of an object (even HTMLElement) from a prototype.
 * In case it's a number, no new instance is made.
 */
export function newInstance(proto: object, ...args: any[]) {

    if (proto === Number.prototype) {
        return parseFloat(args[0])
    }

    return proto instanceof HTMLElement ?
        document.createElement(tagNameFromProto(proto)) :
        new (proto as any).constructor(...args)

}
