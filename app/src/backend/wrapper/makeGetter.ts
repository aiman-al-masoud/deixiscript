import { getNested } from "../../utils/getNested";

export function makeGetter(path: string[]) {

    function f(this: any) {
        return getNested(this, path)
    }

    return f
}