import { Ed } from "../actuator/Ed"
import { Clause } from "../clauses/Clause"
import { Map } from "../clauses/Id"
import ActuatorBrain from "./ActuatorBrain"
import { getOntology, Ontology } from "./Ontology"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Promise<Map[]>
    query(query: Clause): Promise<Map[]>
    assert(code: Clause, opts?:AssertOpts): Promise<Map[]>
    inject(ontology: Ontology): Promise<Brain>
    snapshot():Promise<BrainState>
    diff(before: BrainState): Promise<Clause[]>
    readonly ed: Ed
}

export async function getBrain(): Promise<Brain> { 
    // return await new PrologBrain().inject(getOntology())
    return await new ActuatorBrain().inject(getOntology())
}

export interface AssertOpts{
    noAnaphora : boolean
}

export interface BrainState {
    be: Clause[]
    rel: Clause[]
    beNot: Clause[]
    relNot: Clause[]
}