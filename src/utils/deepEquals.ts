import { hash } from "./hash.ts";

export function deepEquals(a: unknown, b: unknown) {
    // return JSON.stringify(a) === JSON.stringify(b)
    return hash(a) === hash(b)
}