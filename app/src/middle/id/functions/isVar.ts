import { Id } from "../Id";


export function isVar(e: Id) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase());
}
