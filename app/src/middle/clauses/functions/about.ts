import { Id } from "../../id/Id";
import { Clause, emptyClause } from "../Clause";

export function about(clause: Clause, entity: Id) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), emptyClause).simple
}

