import { Clause } from "../Clause"
import { toVar } from "../../id/functions/toVar"
import { isVar } from "../../id/functions/isVar"

export function propagateVarsOwned(clause: Clause): Clause { // anything owned by a var should be also be a var

    const m = clause.entities
        .filter(e => isVar(e))
        .flatMap(e => clause.ownedBy(e))
        .map(e => ({ [e]: toVar(e) }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    return clause.copy({ map: m })

}
