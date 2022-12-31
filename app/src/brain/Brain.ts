import { Ed } from "../actuator/Ed"
import { Clause } from "../clauses/Clause"
import { Map } from "../clauses/Id"
import ActuatorBrain from "./ActuatorBrain"
import { getOntology, Ontology } from "./Ontology"
import PrologBrain from "./PrologBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Promise<Map[]>
    query(query: Clause, opts?: QueryOpts): Promise<Map[]>
    assert(code: Clause, opts?: AssertOpts): Promise<Map[]>
    inject(ontology: Ontology): Promise<Brain>
    snapshot(): Promise<BrainState>
    diff(before: BrainState): Promise<Clause[]>
    readonly ed: Ed
}

export async function getBrain(opts?: GetBrainOpts): Promise<Brain> {

    const cons = opts?.withActuator ? ActuatorBrain : PrologBrain
    return new cons().inject(getOntology())

}


// TODO: just make this a prop of Clause !-----------
export interface AssertOpts {
    noAnaphora: boolean
}

export interface QueryOpts {
    noAnaphora: boolean
}
// ------------



export interface GetBrainOpts {
    withActuator: boolean
}

export interface BrainState {
    be: Clause[]
    rel: Clause[]
    beNot: Clause[]
    relNot: Clause[]
}