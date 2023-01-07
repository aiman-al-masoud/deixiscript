import Brain from "../brain/Brain"
import { Clause } from "../clauses/Clause"

export default interface Action {
    run(brain: Brain): Promise<any>
}


export function getAction(clause: Clause) {

    const ownershipChain = getOwnershipChain(clause)
    console.log({ ownershipChain })

    // DON'T do any of the following immediately, just prepare code for later!

    //1 get the top-level object's ID from an Enviro

    //2 distribute the id to every action (one action per predicate)

    //3 creator actions create the object if it doesn't exist yet

    //4 non-creator actions WAIT if the object doesn't exist yet.

    // (wait is handled by Enviro's get())

}


function getOwnershipChain(clause: Clause) { //TODO: generalize

    const topLevel = clause.entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x)

    const secondLevelEntities = clause.ownedBy(topLevel[0])
    const thridLevelEntities = clause.ownedBy(secondLevelEntities[0])

    const descs = clause.entities.map(e => clause.describe(e))
    console.log({ descs })

    return [topLevel[0], secondLevelEntities[0], thridLevelEntities[0]]
}


