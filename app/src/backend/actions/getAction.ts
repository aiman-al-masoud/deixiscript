import SimpleAction from "./SimpleAction"
import SetAliasAction from "./SetAliasAction"
import MultiAction from "./MultiAction"
import Action from "./Action"
import IfAction from "./IfAction"
import WhenAction from "./WhenAction"
import CreateLexemeAction from "./CreateLexemeAction"
import { Clause } from "../../middle/clauses/Clause"
import Imply from "../../middle/clauses/Imply"


export function getAction(clause: Clause, topLevel: Clause): Action {

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

    if (topLevel.flatList().some(x => x.predicate?.type === 'grammar')) {
        return new CreateLexemeAction(clause, topLevel)
    }

    return new SimpleAction(clause, topLevel)
}