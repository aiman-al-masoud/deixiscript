import { Clause, clauseOf } from "../clauses/Clause";
import { Id } from "../clauses/Id";

export interface Ontology {
    readonly clauses: Clause[]
    readonly objects: [Id, any][]
}

export function getOntology(): Ontology {
    return new BaseOntology()
}

class BaseOntology implements Ontology {

    get objects(): [Id, any][] {
        return [
            ['id100', document.body]
        ]
    }

    get clauses() {
        return [
            clauseOf('body', 'id100')
        ]
    }
}