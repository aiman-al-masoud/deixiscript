import { parseNumber } from "../utils/parseNumber.ts";

export function tokenize(code: string) {
    return code.replace(/\(|\)|\[|\]/g, x => ' ' + x + ' ')
        .split(/\s+/)
        .filter(x => x.length)
        .map(x => parseNumber(x) ?? x)
        .map(x => x === 'true' ? true : x === 'false' ? false : x)
}
