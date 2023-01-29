import { getNewContext } from "./Context"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): any[]
}

export function getBrain(): Brain {
    return new BasicBrain(getNewContext({ root: document.body }))
}
