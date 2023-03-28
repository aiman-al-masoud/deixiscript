import Wrapper from "../../backend/wrapper/Wrapper"
import { GetContextOpts, getNewContext } from "../context/Context"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Wrapper[]
    executeUnwrapped(natlang: string): any[]
}

export interface GetBrainOpts extends GetContextOpts { }

export function getBrain(opts: GetBrainOpts): Brain {
    return new BasicBrain(getNewContext(opts))
}
