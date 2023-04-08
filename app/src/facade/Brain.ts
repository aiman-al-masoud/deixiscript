import { Thing } from "../backend/Thing"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Thing[]
    executeUnwrapped(natlang: string): object[]
}


export function getBrain(): Brain {
    return new BasicBrain()
}
