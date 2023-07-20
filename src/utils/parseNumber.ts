/**
 * Checks if string has some non-digit char (except for ".") before
 * converting to number.
 * 
 * A NON-js-style-lobotomized version that WILL error out if string contains any letter.
 */
export function parseNumber(string: string): number | undefined {

    const nonDig = string.match(/\D/g)?.at(0)

    if (nonDig && nonDig !== '.') {
        return undefined
    }

    return parseFloat(string)

}

