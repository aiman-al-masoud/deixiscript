import { Context } from "../../brain/Context";
import { Clause } from "../Clause";
import Wrapper from "../../enviro/Wrapper";
import { Id } from "../../id/Id";

export function getKool(context: Context, clause: Clause, localId: Id): Wrapper | undefined {

    const ownerIds = clause.ownersOf(localId) // 0 or 1 owner(s)

    if (ownerIds.length === 0) {
        const globalId = context.enviro.query(clause)?.[0]?.[localId]
        return context.enviro.get(globalId)
    }

    const owner = getKool(context, clause, ownerIds[0])

    return owner?.get(clause.about(localId))

}