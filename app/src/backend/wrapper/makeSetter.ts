import { setNested } from "../../utils/setNested";

export function makeSetter(path: string[]) {

    function f(this: unknown, value: any) {
        setNested(this, path, value)
    }

    // Object.defineProperty(f, 'name', { value: `set_${alias}`, writable: true });

    // Object.defineProperty(f, 'name', { value: alias, writable: true });


    return f

}