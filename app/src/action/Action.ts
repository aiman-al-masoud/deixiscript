import { BasicClause } from "../clauses/BasicClause"
import { Clause } from "../clauses/Clause"
import { getRandomId, Id } from "../clauses/Id"
import { Enviro } from "../enviro/Enviro"
import Create from "./Create"
import Edit from "./Edit"

export default interface Action {
    run(enviro: Enviro): Promise<any>
}


export async function takeAction(clause: Clause, enviro: Enviro) {

    const ownershipChain = getOwnershipChain(clause)
    // console.log({ ownershipChain })

    //TODO ??? DON'T do any of the following immediately, just prepare code for later! ???

    //1 get the top-level object's ID from an Enviro, if none create it
    let id = (await enviro.query(clause))[ownershipChain[0]]
    
    if (!id) {
        enviro.setPlaceholder(id = getRandomId())
    }

    //2 determine kind of action (creator or non-creator)
    //3 distribute the id to every action (one action per predicate)

    const actions = clause
        .flatList()
        .map(c => (c as BasicClause))
        .map(c => isCreatorAction(c.predicate) ? new Create(id as Id, c.predicate) : new Edit(id as Id, c.predicate))


    //4 creator actions create the object if it doesn't exist yet
    //5 non-creator actions WAIT if the object doesn't exist yet.
    // (wait is handled by Enviro's get())

    actions.forEach(a => {
        a.run(enviro)
    })

}


function getOwnershipChain(clause: Clause) { //TODO: generalize

    const topLevel = clause.entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x)

    const secondLevelEntities = clause.ownedBy(topLevel[0])
    const thridLevelEntities = clause.ownedBy(secondLevelEntities[0])

    // const descs = clause.entities.map(e => clause.describe(e))
    // console.log({ descs })

    return [topLevel[0], secondLevelEntities[0], thridLevelEntities[0]]
}


function isCreatorAction(predicate: string) {
    return predicate === 'button'
}


