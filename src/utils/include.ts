import { deepEquals } from "./deepEquals.ts";

export function include<T>(iterable: T[], element: T) {
    return iterable.some(x => deepEquals(x, element))
}