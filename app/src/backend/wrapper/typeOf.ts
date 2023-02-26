import { LexemeType } from "../../config/LexemeType"

export function typeOf(o: object): LexemeType | undefined {

    if (typeof o === 'function') {
        return o.length > 0 ? 'mverb' : 'iverb'
    } else if (typeof o === 'boolean') {
        return 'adjective'
    } else if (o) {
        return 'noun'
    }

}