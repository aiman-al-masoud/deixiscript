
/**
 * Checks if string has any non-digit char (except for ".") before
 * converting to number.
 */
export function parseNumber(string: string): number | undefined {

    const nonDig = string.match(/\D/g)?.at(0)

    if (nonDig && nonDig !== '.') {
        return undefined
    }

    return parseFloat(string)

}