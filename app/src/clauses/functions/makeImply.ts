import { Clause, emptyClause } from "../Clause"
import { isVar } from "../../id/functions/isVar"
import Imply from "../Imply"

export function makeImply(clause: Clause) { // any clause with any var is an imply

    if (clause instanceof Imply) {
        return clause
    }

    if (clause.rheme === emptyClause) {
        return clause
    }

    if (clause.entities.some(e => isVar(e))) {
        return clause.theme.implies(clause.rheme)
    }

    return clause
}
