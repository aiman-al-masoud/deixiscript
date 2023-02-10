import { Id } from "../Id";


export function toConst(id: Id): Id {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toLowerCase();
}
