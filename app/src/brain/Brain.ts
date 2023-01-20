import { getConfig } from "../config/Config"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Promise<any[]>
}

export async function getBrain(): Promise<Brain> {

    const b = new BasicBrain(getConfig())
    await b.init()
    return b
}
