import { Clause } from "../Clause";
import { Id } from "../../id/Id";
import Wrapper from "../../../backend/wrapper/Wrapper";
import { Context } from "../../../facade/context/Context";

export function getKool(context: Context, clause: Clause, localId: Id): Wrapper[] {

    const ownerIds = clause.ownersOf(localId) // 0 or 1 owner(s)

    if (ownerIds.length === 0) {
        const maps = context.query(clause)
        return maps
            .map(x => x[localId])
            .filter(x => x)
    }

    const owner = getKool(context, clause, ownerIds[0])
    return owner.flatMap(x => x.get(clause.describe(localId)[0]) ?? [])

}