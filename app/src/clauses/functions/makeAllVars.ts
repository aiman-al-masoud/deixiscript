import { Clause } from "../Clause"
import { isVar } from "../../id/functions/isVar"
import { toConst } from "../../id/functions/toConst"

export function makeAllVars(clause: Clause): Clause { // case insensitive names, if one time var all vars!

    const m = clause.entities
        .filter(x => isVar(x))
        .map(e => ({ [toConst(e)]: e }))
        .reduce((a, b) => ({ ...a, ...b }), {})
    return clause.copy({ map: m })

}
