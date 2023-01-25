import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { getRandomId, Id, isVar, toConst, toVar } from "../clauses/Id";
import { getAnaphora } from "../enviro/Anaphora";
import { AstNode } from "../parser/interfaces/AstNode";
import { AstType } from "../parser/interfaces/Syntax";



interface ToClauseOpts {
    subject?: Id
}

export function toClause(ast?: AstNode<AstType>, args?: ToClauseOpts): Clause {

    if (!ast) {
        throw new Error(`Ast is undefined!`)
    }

    let result

    if (ast?.links?.pronoun || ast?.links?.noun || ast?.links?.adjective) {
        result = nounPhraseToClause(ast, args)
    } else if (ast?.links?.relpron) {
        result = copulaSubClauseToClause(ast, args)
    } else if (ast?.links?.preposition) {
        result = complementToClause(ast, args)
    } else if (ast?.links?.subject && ast?.links.predicate) {
        result = copulaSentenceToClause(ast, args)
    }

    if (result) {
        return propagateVarsOwned(resolveAnaphora(makeAllVars(result)))
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast.type}'!`)

}

function copulaSentenceToClause(copulaSentence: AstNode<AstType>, args?: ToClauseOpts): Clause {

    const subjectAst = copulaSentence?.links?.subject
    const predicateAst = copulaSentence?.links?.predicate
    const subjectId = args?.subject ?? getRandomId()
    const subject = toClause(subjectAst, { subject: subjectId })
    const predicate = toClause(predicateAst, { subject: subjectId }).copy({ negate: !!copulaSentence?.links?.negation })
    const entities = subject.entities.concat(predicate.entities)

    const result = entities.some(e => isVar(e)) ?  // assume any sentence with any var is an implication
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true })

    return result.copy({ sideEffecty: true })

}

function copulaSubClauseToClause(copulaSubClause: AstNode<AstType>, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause?.links?.predicate //as CompositeNode<CompositeType>

    return toClause(predicate, { subject: args?.subject })
        .copy({ sideEffecty: false })
}

function complementToClause(complement: AstNode<AstType>, args?: ToClauseOpts): Clause {

    const subjId = args?.subject ?? getRandomId() //?? ((): Id => { throw new Error('undefined subject id') })()
    const newId = getRandomId()

    const preposition = complement?.links?.preposition?.lexeme

    if (!preposition) {
        throw new Error('No preposition!')
    }

    const nounPhrase = complement?.links?.['noun phrase']

    return clauseOf(preposition, subjId, newId)
        .and(toClause(nounPhrase, { subject: newId }))
        .copy({ sideEffecty: false })

}

function nounPhraseToClause(nounPhrase: AstNode<AstType>, args?: ToClauseOpts): Clause {

    const maybeId = args?.subject ?? getRandomId()
    const subjectId = nounPhrase?.links?.uniquant ? toVar(maybeId) : maybeId

    const adjectives = nounPhrase?.links?.adjective?.list ?? []
    const noun = nounPhrase?.links?.noun ?? nounPhrase?.links?.pronoun
    const complements = nounPhrase?.links?.complement?.list ?? []
    const subClause = nounPhrase?.links?.subclause

    const res =
        adjectives.flatMap(a => a.lexeme ?? [])
            .concat(noun?.lexeme ? [noun.lexeme] : [])
            .map(p => clauseOf(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), emptyClause())
            .and(complements.map(c => c ? toClause(c, { subject: subjectId }) : emptyClause()).reduce((c1, c2) => c1.and(c2), emptyClause()))
            .and(subClause ? toClause(subClause, { subject: subjectId }) : emptyClause())
            .copy({ sideEffecty: false })

    return res
}

function makeAllVars(clause: Clause): Clause { // assume ids are case insensitive, assume if IDX is var all idx are var

    const m = clause.entities
        .filter(x => isVar(x))
        .map(e => ({ [toConst(e)]: e }))
        .reduce((a, b) => ({ ...a, ...b }), {})
    return clause.copy({ map: m })

}

function resolveAnaphora(clause: Clause): Clause {

    if (clause.rheme.hashCode === emptyClause().hashCode) {
        return clause
    }

    const a = getAnaphora()
    a.assert(clause.theme)
    return clause.copy({ map: a.query(clause.rheme)[0] ?? {} })
}

function propagateVarsOwned(clause: Clause): Clause {// assume anything owned by a variable is also a variable

    const m = clause.entities
        .filter(e => isVar(e))
        .flatMap(e => clause.ownedBy(e))
        .map(e => ({ [e]: toVar(e) }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    return clause.copy({ map: m })

}