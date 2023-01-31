import { Clause } from "../../clauses/Clause"
import { Id } from "../../clauses/Id"
import { Context } from "../../brain/Context"
import { isConcept } from "../../lexer/Lexeme"
import Action from "./Action"
import ConceptAction from "./ConceptAction"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"

export default class RootAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context): any {

        // relations (multi arg predicates) except for 'of' 
        if (this.clause.args && this.clause.args.length > 1 && this.clause.predicate && this.clause.predicate.root !== 'of') {
            return new RelationAction(this.clause, this.topLevel).run(context)
        }

        // for anaphora resolution (TODO: remove)
        if (this.clause.exactIds) {
            return new EditAction(this.clause, this.topLevel).run(context)
        }

        // to create new concept or new instance thereof
        if (this.clause.args && this.topLevel.rheme.describe(this.clause.args[0]).some(x => isConcept(x))) { // 
            return new ConceptAction(this.clause, this.topLevel).run(context)
        }

        if (this.clause.predicate?.proto) {
            return new CreateAction(this.clause, this.topLevel).run(context)
        }

        return new EditAction(this.clause, this.topLevel).run(context)

    }

}

export function lookup(id: Id, context: Context, topLevel: Clause, exactIds: boolean) { // based on theme info only

    if (exactIds) {
        return id
    }

    const q = topLevel.theme.about(id)
    const maps = context.enviro.query(q)
    const res = maps?.[0]?.[id] //TODO could be undefined
    return res
}