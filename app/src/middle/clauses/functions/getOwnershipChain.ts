import { Clause } from "../Clause"
import { Id } from "../../id/Id"
import { getTopLevel } from "./topLevel"

export function getOwnershipChain(clause: Clause, entity: Id |undefined = getTopLevel(clause)[0]): Id[] {

    // const ownedEntities = clause.ownedBy(entity)

    // const topLevel = getTopLevel(clause)[0]

    if (!entity) {
        return []
    }

    const ownedEntities = clause.ownedBy(entity)

    return ownedEntities.length === 0 ?
        [entity] :
        [entity].concat(getOwnershipChain(clause, ownedEntities[0]))

}