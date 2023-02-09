
/**
 * Remove duplicates from a list of primitives (numbers, bools, strings).
 * Careful using this with objects.
 */
export const uniq = (x: any[]) => Array.from(new Set(x))
