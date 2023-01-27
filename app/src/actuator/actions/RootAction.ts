import { BasicClause } from "../../clauses/BasicClause";
import { Clause } from "../../clauses/Clause";
import { Id, getRandomId } from "../../clauses/Id";
import { Context } from "../../brain/Context";
import { isConcept } from "../../lexer/Lexeme";
import Action from "./Action";
import ConceptAction from "./ConceptAction";
import CreateAction from "./CreateAction";
import EditAction from "./EditAction";
import RelationAction from "./RelationAction";

export default class RootAction implements Action {

    constructor(readonly clause: BasicClause, readonly topLevel: Clause) {

    }

    run(context: Context): any {

        if (this.clause.args.length > 1 && this.clause.predicate.root !== 'of') { // relations 

            return new RelationAction(this.topLevel,
                this.clause.predicate,
                this.clause.args,
                this.clause.negated).run(context)

        }

        if (this.clause.exactIds) {
            return new EditAction(this.clause.args[0], this.clause.predicate, []).run(context)
        }

        if (this.topLevel.rheme.describe(this.clause.args[0]).some(x => isConcept(x))) { // 
            return new ConceptAction(this.clause.args[0],
                this.clause.predicate,
                this.topLevel).run(context)
        }

        if (this.topLevel.topLevel().includes(this.clause.args[0])) {
            this.forTopLevel(context)
        } else {
            this.forNonTopLevel(context)
        }

    }

    protected getProps(topLevelEntity: Id) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]) // ASSUME at least one
    }

    protected forTopLevel(context: Context) { // this id is TL entity

        const q = this.topLevel.theme.about(this.clause.args[0])
        const maps = context.enviro.query(q)
        const id = maps?.[0]?.[this.clause.args[0]] ?? getRandomId()

        if (!context.enviro.get(id)) {
            context.enviro.setPlaceholder(id)
        }

        if (this.clause.predicate.proto) {
            return new CreateAction(id,
                this.clause.predicate).run(context)
        } else {
            return new EditAction(id, this.clause.predicate,
                this.getProps(this.clause.args[0])).run(context)
        }
    }

    protected forNonTopLevel(context: Context) {

        const tLOwner = this.getTopLevelOwnerOf(this.clause.args[0], this.topLevel)

        if (!tLOwner) {
            return
        }

        const nameOfThis = this.topLevel.theme.describe(this.clause.args[0])

        if (this.clause.predicate.root == nameOfThis[0].root) {
            return
        }

        const q = this.topLevel.theme.about(tLOwner)
        const maps = context.enviro.query(q)
        const tLOwnerId = maps?.[0]?.[tLOwner] //?? getRandomId()

        return new EditAction(tLOwnerId,
            this.clause.predicate, this.getProps(tLOwner)).run(context)
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