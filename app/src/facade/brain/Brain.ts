import {Thing} from "../../backend/thing/Thing"
import { GetContextOpts, getContext } from "../context/Context"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Thing[]
    executeUnwrapped(natlang: string): any[]
}

export interface GetBrainOpts extends GetContextOpts { }

export function getBrain(opts: GetBrainOpts): Brain {
    return new BasicBrain(getContext(opts))
}
