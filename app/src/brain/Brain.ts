import { Ed } from "../actuator/Ed"
import { Clause } from "../clauses/Clause"
import { Map } from "../clauses/Id"
import PrologBrain from "./PrologBrain"

/**
 * The main facade controller.
 */
export default interface Brain{
    execute(natlang:string):Promise<Map[]>
    query(query:Clause): Promise<Map[]>
    assert(code:Clause):Promise<void>
    readonly ed:Ed
}

export async function getBrain():Promise<Brain>{ // async due to possible init phase (in the future)
    return await new PrologBrain().init()
}