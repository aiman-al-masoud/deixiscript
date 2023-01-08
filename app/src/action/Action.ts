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

    //1 get the top-level object's ID from an Enviro, if none create it
    let id = (await enviro.query(clause))[ownershipChain[0]]

    if (!id) {
        enviro.setPlaceholder(id = getRandomId())
    }

    const props = ownershipChain.slice(1).map(e=>clause.theme.describe(e)[0]).filter(x=>x!==undefined) // inner props of top level entity

    //2 determine kind of action (creator or non-creator)
    //3 distribute the id to every action (one action per predicate)

    const actions = clause
        .flatList()
        .map(c => (c as BasicClause))
        .map(c => isCreatorAction(c.predicate) ? new Create(id as Id, c.predicate) : new Edit(id as Id, c.predicate, props))

    //4 creator actions create the object if it doesn't exist yet
    //5 non-creator actions WAIT if the object doesn't exist yet.

    for (const a of actions){
        await a.run(enviro) // TODO: make this async-safe
    }

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

function isCreatorAction(predicate: string) {
    return predicate === 'button'
}