import Brain from "../brain/Brain"
import { Clause } from "../clauses/Clause"

export default interface Action {
    run(brain: Brain): Promise<any>
}


export function getAction(clause: Clause) {

    const ownershipChain = getOwnershipChain(clause)
    console.log({ ownershipChain })

    // get the top-level object T, from Enviro, as a Wrapper object

    // if T doesn't exist, create it with the first available constructor action, (put the other actions on hold??)

    // tell T it has to apply a predicate, on ownershipChain[1:] props if any



}


function getOwnershipChain(clause: Clause) { //TODO: generalize

    const topLevel = clause.entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x)

    const secondLevelEntities = clause.ownedBy(topLevel[0])
    const thridLevelEntities = clause.ownedBy(secondLevelEntities[0])

    return [topLevel[0], secondLevelEntities[0], thridLevelEntities[0]]
}


