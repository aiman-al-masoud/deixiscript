import { Clause } from "../Clause"

export function invertEffect(clause: Clause) {

    return clause.copy({
        clause1: clause.theme.simple,
        clause2: clause.rheme.simple.copy({ negate: true })
    })

}
