import { Clause } from "../../clauses/Clause"
import { isConcept } from "../../lexer/functions/isConcept"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"
import Imply from "../../clauses/Imply"
import SetAliasAction from "./SetAliasAction"
import MultiAction from "./MultiAction"
import Action from "./Action"
import IfAction from "./IfAction"
import WhenAction from "./WhenAction"
import CreateLexemeAction from "./CreateLexemeAction"


export function getAction(clause: Clause, topLevel: Clause): Action {

    if (topLevel.flatList().some(x => x.predicate?.type === 'grammar')
        || topLevel.rheme.flatList().some(x => isConcept(x.predicate))) {

        return new CreateLexemeAction(clause, topLevel)
    }

    // TODO: prepositions, and be beware of 'of' 
    if (clause.predicate?.type === 'iverb' || clause.predicate?.type === 'mverb') {
        return new RelationAction(clause, topLevel)
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