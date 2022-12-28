import { Ed } from "../actuator/Ed"
import { Clause } from "../clauses/Clause"
import { Map } from "../clauses/Id"
import { getOntology, Ontology } from "./Ontology"
import PrologBrain from "./PrologBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Promise<Map[]>
    query(query: Clause): Promise<Map[]>
    assert(code: Clause): Promise<void>
    inject(ontology: Ontology): Promise<Brain>
    readonly ed: Ed
}

export async function getBrain(): Promise<Brain> { 
    return await new PrologBrain().inject(getOntology())
}