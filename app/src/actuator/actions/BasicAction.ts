import { BasicClause } from "../../clauses/BasicClause";
import { Clause } from "../../clauses/Clause";
import { Id, getRandomId } from "../../clauses/Id";
import { Enviro } from "../../enviro/Enviro";
import Action from "./Action";
import CreateAction from "./CreateAction";
import EditAction from "./EditAction";

export default class BasicAction implements Action {

    constructor(readonly clause: BasicClause, readonly topLevel: Clause) {

    }

    run(enviro: Enviro): any {

        if (this.clause.args.length > 1) { // not handling relations yet
            return
        }

        if (this.clause.exactIds) {
            return new EditAction(this.clause.args[0], this.clause.predicate, []).run(enviro)
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

    protected forTopLevel(enviro: Enviro) { // this id is TL entity

        const q = this.topLevel.theme.about(this.clause.args[0])
        const maps = enviro.query(q)
        const id = maps?.[0]?.[this.clause.args[0]] ?? getRandomId()

        if (!enviro.get(id)) {
            enviro.setPlaceholder(id)
        }

        // if (this.clause.predicate.isConcept) {
        //     console.log('new instance of concept:', this.topLevel.theme.describe(this.clause.args[0])[0].root.toUpperCase(), 'is a', this.clause.predicate.root.toUpperCase())
        // }

        // if (this.clause.predicate.root === 'concept') {
        //     console.log('new concept:', this.topLevel.theme.describe(this.clause.args[0])[0].root.toUpperCase())
        // }

        if (this.clause.predicate.proto) {
            new CreateAction(id, this.clause.predicate).run(enviro)
        } else {
            new EditAction(id, this.clause.predicate, this.getProps(this.clause.args[0])).run(enviro)
        }
    }

    protected forNonTopLevel(enviro: Enviro) {

        const tLOwner = this.getTopLevelOwnerOf(this.clause.args[0], this.topLevel)

        if (!tLOwner) {
            return
        }

        const nameOfThis = this.topLevel.theme.describe(this.clause.args[0])

        if (this.clause.predicate.root == nameOfThis[0].root) {
            return
        }

        const q = this.topLevel.theme.about(tLOwner)
        const maps = enviro.query(q)
        const tLOwnerId = maps?.[0]?.[tLOwner] //?? getRandomId()

        return new EditAction(tLOwnerId, this.clause.predicate, this.getProps(tLOwner)).run(enviro)
    }

    protected getTopLevelOwnerOf(id: Id, topLevel: Clause): Id | undefined {

        const owners = topLevel.ownersOf(id)

        const maybe = owners
            .filter(o => topLevel.topLevel().includes(o)).at(0)

        if (!maybe && owners.length > 0) {
            return this.getTopLevelOwnerOf(owners[0], topLevel)
        } else {
            return maybe
        }

    }

}