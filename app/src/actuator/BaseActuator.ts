import { BasicClause } from "../clauses/BasicClause";
import { Clause } from "../clauses/Clause";
import { getRandomId, Id } from "../clauses/Id";
import { Enviro } from "../enviro/Enviro";
import { Actuator } from "./Actuator";
import Create from "./Create";
import Edit from "./Edit";

export default class BaseActuator implements Actuator {


    async takeAction(clause: Clause, enviro: Enviro): Promise<void> {

        const ownershipChain = clause.getOwnershipChain(clause.topLevel()[0])

        //1 get the top-level object's ID from an Enviro, if none create it
        let id = (await enviro.query(clause))[ownershipChain[0]]

        if (!id) {
            enviro.setPlaceholder(id = getRandomId())
        }

        const props =  // inner props of top level entity
            ownershipChain
                .slice(1)
                .map(e => clause.theme.describe(e)[0])
                .filter(x => x !== undefined)

        //2 determine kind of action (creator or non-creator)
        //3 distribute the id to every action (one action per predicate)

        const actions = clause
            .flatList()
            .map(c => (c as BasicClause))
            .map(c => isCreatorAction(c.predicate) ? new Create(id as Id, c.predicate) : new Edit(id as Id, c.predicate, props))

        //4 creator actions create the object if it doesn't exist yet
        //5 non-creator actions WAIT if the object doesn't exist yet.

        for (const a of actions) {
            await a.run(enviro) // TODO: make this async-safe
        }
    }

}

function isCreatorAction(predicate: string) {
    return predicate === 'button'
}