import { getConfig } from "../config/Config"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Promise<any[]>
}

export async function getBrain(config = getConfig()): Promise<Brain> {

    const b = new BasicBrain(config)
    await b.init()
    return b
}
