import { Thing } from "../backend/Thing"
import BasicBrain from "./BasicBrain"
import { BrainListener } from "./BrainListener"

/**
 * A facade to the Deixiscript interpreter.
 */
export default interface Brain {
    execute(natlang: string): Thing[]
    executeUnwrapped(natlang: string): (object | number | string)[]
    addListener(listener: BrainListener): void
}

export function getBrain(): Brain {
    return new BasicBrain()
}
