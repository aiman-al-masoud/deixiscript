import { getNested } from "../../utils/getNested";

export function makeGetter(alias: string, path: string[]) {

    function f(this: any) {
        return getNested(this, path)
    }

    Object.defineProperty(f, 'name', { value: alias, writable: true })
    return f
}