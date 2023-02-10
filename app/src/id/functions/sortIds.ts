import { Id } from "../Id";
import { idToNum } from "./idToNum";

/**
 * Sort ids in ascending order.
 */

export function sortIds(ids: Id[]) {
    return ids.sort((a, b) => idToNum(a) - idToNum(b));
}
