import { LexemeType } from "../../config/LexemeType"

export function typeOf(o: object): LexemeType | undefined {

    switch (typeof o) {
        case 'function':
            return o.length > 0 ? 'mverb' : 'iverb'
        case 'boolean':
            return 'adjective'
        case 'undefined':
            return undefined
        default:
            return 'noun'
    }

}