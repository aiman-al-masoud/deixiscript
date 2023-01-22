import { BasicClause } from "../clauses/BasicClause";
import { Clause } from "../clauses/Clause";
import { getRandomId, Id } from "../clauses/Id";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";
import Create from "./Create";
import Edit from "./Edit";

export default class BasicAction implements Action {

    constructor(readonly clause: BasicClause, readonly topLevel: Clause) {

    }

    run(enviro: Enviro): any {

        if (this.clause.args.length > 1) { // not handling relations yet
            return
        }

        if (this.clause.exactIds) {
            return new Edit(this.clause.args[0], this.clause.predicate, []).run(enviro)
        }

        if (this.topLevel.topLevel().includes(this.clause.args[0])) {
            this.forTopLevel(enviro)
        } else {
            this.forNonTopLevel(enviro)
        }

    }

    protected getProps(topLevelEntity: Id) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]) // ASSUME at least one
    }

    protected forTopLevel(enviro: Enviro) {

        const q = this.topLevel.theme.about(this.clause.args[0])
        const maps = enviro.query(q)
        const id = maps?.[0]?.[this.clause.args[0]] ?? getRandomId()

        if (!enviro.get(id)) {
            enviro.setPlaceholder(id)
        }

        if (isCreatorAction(this.clause.predicate.root)) {
            new Create(id, this.clause.predicate).run(enviro)
        } else {
            new Edit(id, this.clause.predicate, this.getProps(this.clause.args[0])).run(enviro)
        }
    }

    protected forNonTopLevel(enviro: Enviro) {

        // assuming max x.y.z nesting
        const owners = this.topLevel.ownersOf(this.clause.args[0])
        const hasTopLevel = owners.filter(x => this.topLevel.topLevel().includes(x))[0]
        const topLevelOwner = hasTopLevel ? hasTopLevel : this.topLevel.ownersOf(owners[0])[0]

        if (topLevelOwner === undefined) {
            return
        }

        const nameOfThis = this.topLevel.theme.describe(this.clause.args[0])

        if (this.clause.predicate.root == nameOfThis[0].root) {
            return
        }

        const q = this.topLevel.theme.about(topLevelOwner)
        const maps = enviro.query(q)
        const id = maps?.[0]?.[topLevelOwner] //?? getRandomId()

        return new Edit(id, this.clause.predicate, this.getProps(topLevelOwner)).run(enviro)
    }

}

function isCreatorAction(predicate: string) {
    return predicate === 'button'
}