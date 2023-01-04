import { Ed } from "./Ed"
import { Clause } from "../clauses/Clause"
import { Map } from "../clauses/Id"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    readonly ed: Ed
    execute(natlang: string): Promise<any[]>
    query(query: Clause): Promise<Map[]>
    assert(code: Clause, opts?: AssertOpts): Promise<Map[]>
}

//TODO: where to put pointOut(id[])? (formerly in Actuator)

export async function getBrain(opts?: GetBrainOpts): Promise<Brain> {
    return new BasicBrain()
}

export interface AssertOpts {
    fromBelow: boolean
}

export interface GetBrainOpts {
    withActuator: boolean
}

export interface BrainState {
    be: Clause[]
    rel: Clause[]
    beNot: Clause[]
    relNot: Clause[]
}