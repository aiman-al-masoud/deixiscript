import { Clause } from "../Clause"
import { Id } from "../Id"

export function getOwnershipChain(clause: Clause, entity: Id): Id[] {

    const ownedEntities = clause.ownedBy(entity)

    return ownedEntities.length === 0 ?
        [entity] :
        [entity].concat(getOwnershipChain(clause, ownedEntities[0]))

}