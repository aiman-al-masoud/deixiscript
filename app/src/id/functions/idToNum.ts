import { Id } from "../Id";




export function idToNum(id: Id) {
    return parseInt(id.toString().replaceAll(/\D+/g, ''));
}
