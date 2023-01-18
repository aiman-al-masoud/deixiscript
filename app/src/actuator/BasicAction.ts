import { BasicClause } from "../clauses/BasicClause";
import { Clause } from "../clauses/Clause";
import { getRandomId } from "../clauses/Id";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";
import Create from "./Create";
import Edit from "./Edit";

export default class BasicAction implements Action {

    constructor(readonly clause: BasicClause, readonly topLevel: Clause) {

    }

    async run(enviro: Enviro): Promise<any> {

        if (this.clause.noAnaphora) {
            return await new Edit(this.clause.args[0], this.clause.predicate, []).run(enviro)
        }

        if (!this.topLevel.topLevel().includes(this.clause.args[0])) { // avoid NON top-level entities
            return
        }

        const q = this.topLevel.theme.about(this.clause.args[0])
        const maps = await enviro.query(q)
        const id = maps?.[0]?.[this.clause.args[0]] ?? getRandomId()

        if (!await enviro.get(id)) {
            enviro.setPlaceholder(id)
        }

        if (isCreatorAction(this.clause.predicate)) {

            new Create(id, this.clause.predicate).run(enviro)

        } else { // Edit Action

            const props = this.topLevel
                .getOwnershipChain(this.clause.args[0])
                .slice(1)
                .map(e => this.topLevel.theme.describe(e)[0])

            new Edit(id, this.clause.predicate, props).run(enviro)
        }

    }

}

function isCreatorAction(predicate: string) {
    return predicate === 'button'
}