import { Clause } from "../../clauses/Clause"
import { Id } from "../../id/Id"
import { Context } from "../../brain/Context"
import { isConcept } from "../../lexer/functions/isConcept"
import ConceptAction from "./ConceptAction"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"
import Imply from "../../clauses/Imply"
import SetAliasAction from "./SetAliasAction"
import MultiEditAction from "./MultiEditAction"
import Action from "./Action"


export function getAction(clause: Clause, topLevel: Clause): Action {

    // TODO: prepositions, and be beware of 'of' 
    if (clause.predicate?.type === 'iverb' || clause.predicate?.type === 'mverb') {
        return new RelationAction(clause, topLevel)
    }

    // to create new concept or new instance thereof
    if (clause.args && topLevel.rheme.describe(clause.args[0]).some(x => isConcept(x))) { // 
        return new ConceptAction(clause, topLevel)
    }

    if (clause.predicate?.proto) {
        return new CreateAction(clause, topLevel)
    }

    if (clause instanceof Imply && clause.entities.some(e => clause.ownersOf(e).length)) {
        return new SetAliasAction(clause)
    }

    if (clause instanceof Imply) {
        return new MultiEditAction(clause)
    }

    return new EditAction(clause, topLevel)
}

export function lookup(id: Id, context: Context, topLevel: Clause) {
    const maps = context.enviro.query(topLevel.theme) // 
    return maps?.[0]?.[id] //TODO could be undefined
}