import { Context } from "../../brain/Context";
import { Clause } from "../Clause";
import Wrapper from "../../enviro/Wrapper";
import { Id } from "../../id/Id";

export function getKool(context: Context, clause: Clause, localId: Id): Wrapper[] {

    const ownerIds = clause.ownersOf(localId) // 0 or 1 owner(s)

    if (ownerIds.length === 0) {
        const maps = context.enviro.query(clause)
        return maps.map(x => x[localId]).flatMap(x => context.enviro.get(x) ?? [])
    }

    const owner = getKool(context, clause, ownerIds[0])
    return owner.flatMap(x => x.get(clause.about(localId)) ?? [])

}