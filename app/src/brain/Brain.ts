import { Enviro } from "../enviro/Enviro"
import { Clause } from "../clauses/Clause"
import { Map } from "../clauses/Id"
import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    readonly enviro: Enviro
    execute(natlang: string): Promise<any[]>
    // query(query: Clause): Promise<Map[]>
    // assert(code: Clause, opts?: AssertOpts): Promise<Map[]>
}

//TODO: where to put pointOut(id[])? (formerly in Actuator)

export async function getBrain(opts?: GetBrainOpts): Promise<Brain> {
    return new BasicBrain()
}

// export interface AssertOpts {
//     fromBelow: boolean
// }

export interface GetBrainOpts {
    withActuator: boolean
}