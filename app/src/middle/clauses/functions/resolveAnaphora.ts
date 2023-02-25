import { Clause } from "../Clause"

export function resolveAnaphora(clause: Clause): Clause {

    const m = clause.theme.query(clause.rheme)[0]
    return clause.copy({ map: m ?? {} })

}
