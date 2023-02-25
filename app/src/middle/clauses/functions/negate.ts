import { Clause } from "../Clause"

//TODO: consider moving to Clause.copy({negate}) !!!!!
export function negate(clause: Clause, negate: boolean) {

    if (!negate) {
        return clause
    }

    return clause.copy({ clause1: clause.theme.simple, clause2: clause.rheme.simple.copy({ negate }) })

}
