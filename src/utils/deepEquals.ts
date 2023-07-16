import { hash } from "./hash.ts";

export function deepEquals(a: unknown, b: unknown) {
    return hash(a) === hash(b)
}