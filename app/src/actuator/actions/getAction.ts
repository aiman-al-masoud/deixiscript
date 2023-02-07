import { Clause } from "../../clauses/Clause"
import { Id } from "../../clauses/Id"
import { Context } from "../../brain/Context"
import { isConcept } from "../../lexer/functions/isConcept"
import ConceptAction from "./ConceptAction"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"
import Imply from "../../clauses/Imply"
import ImplyAction from "./ImplyAction"


export function getAction(clause: Clause, topLevel: Clause) {

    if (clause instanceof Imply) {
        return new ImplyAction(clause)
    }

    // TODO: prepositions, and be beware of 'of' 
    if (clause.predicate?.type === 'iverb' || clause.predicate?.type === 'mverb') {
        return new RelationAction(clause, topLevel)
    }

    // for anaphora resolution (TODO: remove)
    if (clause.exactIds) {
        return new EditAction(clause, topLevel)
    }

    // to create new concept or new instance thereof
    if (clause.args && topLevel.rheme.describe(clause.args[0]).some(x => isConcept(x))) { // 
        return new ConceptAction(clause, topLevel)
    }

    if (clause.predicate?.proto) {
        return new CreateAction(clause, topLevel)
    }

    return new EditAction(clause, topLevel)
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