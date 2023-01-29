import { BasicClause } from "../../clauses/BasicClause"
import { Clause } from "../../clauses/Clause"
import { Id, getRandomId } from "../../clauses/Id"
import { Context } from "../../brain/Context"
import { isConcept } from "../../lexer/Lexeme"
import Action from "./Action"
import ConceptAction from "./ConceptAction"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"

export default class RootAction implements Action {

    constructor(readonly clause: BasicClause, readonly topLevel: Clause) {

    }

    run(context: Context): any {

        // relations (multi arg predicates) except for 'of' 
        if (this.clause.args.length > 1 && this.clause.predicate.root !== 'of') {

            return new RelationAction(
                this.topLevel,
                this.clause.predicate,
                this.clause.args,
                this.clause.negated)
                .run(context)

        }

        // for anaphora resolution (TODO: remove)
        if (this.clause.exactIds) {
            return new EditAction(
                this.clause.args[0],
                this.clause.predicate,
                [])
                .run(context)
        }

        // to create new concept or new instance thereof
        if (this.topLevel.rheme.describe(this.clause.args[0]).some(x => isConcept(x))) { // 
            return new ConceptAction(
                this.clause.args[0],
                this.clause.predicate,
                this.topLevel)
                .run(context)
        }

        // 
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

        if (this.clause.predicate.proto) {
            return new CreateAction(
                id,
                this.clause.predicate)
                .run(context)
        } else {
            return new EditAction(
                id,
                this.clause.predicate,
                this.getProps(this.clause.args[0]))
                .run(context)
        }
    }

    protected forNonTopLevel(context: Context) {

        const tLOwner = this.topLevel.getTopLevelOwnerOf(this.clause.args[0])

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

        return new EditAction(
            tLOwnerId,
            this.clause.predicate,
            this.getProps(tLOwner))
            .run(context)
    }

}