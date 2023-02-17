import { Clause, emptyClause } from "../Clause";
import { isVar } from "../../id/functions/isVar";
import Imply from "../Imply";

export function makeImply(clause: Clause) {

    if (clause instanceof Imply) {
        return clause;
    }

    if (clause.rheme === emptyClause) {
        return clause;
    }

    if (clause.entities.some(e => isVar(e))) {
        const r = clause.theme.implies(clause.rheme).copy({ sideEffecty: clause.isSideEffecty });
        return r;
    }

    return clause;
}
