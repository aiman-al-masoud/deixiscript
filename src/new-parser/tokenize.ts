import { parseNumber } from "../utils/parseNumber.ts";
import { putInBetween } from "../utils/putInBetween.ts";

export function tokenize(code: string) {

    const s0 = code.split('"')
    const s1 = putInBetween(s0, '"').filter(x => x.length)

    const s2 = s1.slice().reduce((acc, x, i, ar) => {
        if (ar[i - 1] === '"' && ar[i + 1] === '"') {
            ar[i - 1] = ''
            ar[i + 1] = ''
            return [...acc, '"' + x + '"']
        }
        if (x === '"') return acc
        return [...acc, x]
    }, [] as string[])

    const s3 = s2.filter(x => x.length)
    const s4 = s3.flatMap(x => isString(x) ? x :
        x.toLowerCase()
            .replace(/\(|\)|\[|\]/g, x => ' ' + x + ' ')
            .split(/\s+/).filter(x => x.length)
            .map(x => parseNumber(x) ?? x)
            .map(x => x === 'true' ? true : x === 'false' ? false : x))

    return s4

}

function isString(s: string) {
    return s[0] === '"' && s.at(-1) === '"'
}
