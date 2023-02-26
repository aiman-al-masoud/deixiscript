import { LexemeType } from "../../config/LexemeType"

export function typeOf(o: object): LexemeType | undefined {

    if (typeof o === 'function') {
        return (o.length ?? 0) > 0 ? 'mverb' : 'iverb'
    }

    if (typeof o === 'boolean') {
        return 'adjective'
    }

    if (o === undefined) {
        return undefined
    }

    return 'noun'
}