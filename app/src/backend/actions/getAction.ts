import SimpleAction from "./SimpleAction"
import SetAliasAction from "./SetAliasAction"
import Action from "./Action"
import IfAction from "./IfAction"
import WhenAction from "./WhenAction"
import { Clause } from "../../middle/clauses/Clause"
import Imply from "../../middle/clauses/Imply"


export function getAction(clause: Clause, topLevel: Clause): Action {

    if (clause instanceof Imply && clause.subjconj?.root === 'if') {
        return new IfAction(clause)
    }

    if (clause instanceof Imply && clause.subjconj?.root === 'when') {
        return new WhenAction(clause)
    }

    if (topLevel.theme.entities.some(e => topLevel.theme.ownersOf(e).length) && topLevel.rheme.entities.some(e => topLevel.rheme.ownersOf(e).length)) {
        return new SetAliasAction(topLevel)
    }

    return new SimpleAction(clause, topLevel)
}