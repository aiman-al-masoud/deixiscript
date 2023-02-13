import { Clause } from "../../clauses/Clause"
import { isConcept } from "../../lexer/functions/isConcept"
import ConceptAction from "./ConceptAction"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"
import Imply from "../../clauses/Imply"
import SetAliasAction from "./SetAliasAction"
import MultiAction from "./MultiAction"
import Action from "./Action"
import IfAction from "./IfAction"
import WhenAction from "./WhenAction"


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

    if (clause instanceof Imply && clause.theme.entities.some(e => clause.theme.ownersOf(e).length) && clause.rheme.entities.some(e => clause.rheme.ownersOf(e).length)) {
        return new SetAliasAction(clause)
    }

    if (clause instanceof Imply && clause.subjconj?.root === 'if') {
        return new IfAction(clause)
    }

    if (clause instanceof Imply && clause.subjconj?.root === 'when') {
        return new WhenAction(clause)
    }

    if (clause instanceof Imply) {
        return new MultiAction(clause)
    }

    return new EditAction(clause, topLevel)
}