import { Clause } from "../../clauses/Clause"
import { Id } from "../../clauses/Id"
import { Context } from "../../brain/Context"
import { isConcept } from "../../lexer/Lexeme"
import ConceptAction from "./ConceptAction"
import CreateAction from "./CreateAction"
import EditAction from "./EditAction"
import RelationAction from "./RelationAction"


export function getAction(clause: Clause, topLevel: Clause) {

    // relations (multi arg predicates) except for 'of' 
    if (clause.args && clause.args.length > 1 && clause.predicate && clause.predicate.root !== 'of') {
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
    
    // console.log('getAction()', topLevel.about(id).toString())

    const maps = context.enviro.query(q)
    const res = maps?.[0]?.[id] //TODO could be undefined
    return res
}