import { getConfig } from "../config/Config"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): any[]
}

export function getBrain(config = getConfig()): Brain {
    return new BasicBrain(config)
}
