import { Id } from "../Id";


export function toVar(id: Id): Id {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase();
}
