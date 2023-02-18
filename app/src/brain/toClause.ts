import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { Id } from "../id/Id";
import { getIncrementalId } from "../id/functions/getIncrementalId";
import { toVar } from "../id/functions/toVar";
import { AstNode } from "../parser/interfaces/AstNode";
import { makeAllVars } from "../clauses/functions/makeAllVars";
import { propagateVarsOwned } from "../clauses/functions/propagateVarsOwned";
import { resolveAnaphora } from "../clauses/functions/resolveAnaphora";
import { makeImply } from "../clauses/functions/makeImply";
import { negate } from "../clauses/functions/negate";

interface ToClauseOpts {
    subject?: Id
}

export function toClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    if (!ast) {
        console.warn('Ast is undefined!')
        return emptyClause
    }

    let result

    if (ast.type === 'noun phrase') {
        result = nounPhraseToClause(ast, args)
    } else if (ast?.links?.relpron) {
        result = copulaSubClauseToClause(ast, args)
    } else if (ast?.links?.preposition) {
        result = complementToClause(ast, args)
    } else if (ast?.links?.subject && ast?.links.predicate) {
        result = copulaSentenceToClause(ast, args)
    } else if (ast.links?.nonsubconj) {
        result = andSentenceToClause(ast, args)
    } else if (ast.links?.iverb || ast.links?.mverb) {
        result = verbSentenceToClause(ast, args)
    } else if (ast.links?.subconj) {
        result = complexSentenceToClause(ast, args)
    }

    if (result) {
        const c0 = makeImply(result)
        const c1 = makeAllVars(c0)
        const c2 = resolveAnaphora(c1)
        const c3 = propagateVarsOwned(c2)
        const c4 = negate(c3, !!ast?.links?.negation)
        const c5 = c4.copy({ sideEffecty: c4.rheme !== emptyClause })
        return c5
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast.type}'!`)

}

function copulaSentenceToClause(copulaSentence: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const subject = toClause(copulaSentence?.links?.subject, { subject: subjectId })
    const predicate = toClause(copulaSentence?.links?.predicate, { subject: subjectId })

    return subject.and(predicate, { asRheme: true })
}

function copulaSubClauseToClause(copulaSubClause: AstNode, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause?.links?.predicate
    return toClause(predicate, { subject: args?.subject })
}

function complementToClause(complement: AstNode, args?: ToClauseOpts): Clause {

    const subjId = args?.subject ?? getIncrementalId()
    const newId = getIncrementalId()

    const nounPhrase = complement?.links?.['noun phrase']
    const preposition = complement?.links?.preposition?.lexeme

    if (!preposition) {
        throw new Error('No preposition!')
    }

    return clauseOf(preposition, subjId, newId)
        .and(toClause(nounPhrase, { subject: newId }))

}

function nounPhraseToClause(nounPhrase: AstNode, args?: ToClauseOpts): Clause {

    const maybeId = args?.subject ?? getIncrementalId()
    const subjectId = nounPhrase?.links?.uniquant ? toVar(maybeId) : maybeId

    const adjectives = nounPhrase?.links?.adjective?.list ?? []
    const noun = nounPhrase.links?.subject
    const complements = nounPhrase?.links?.complement?.list ?? []
    const subClause = nounPhrase?.links?.subclause

    const res =
        adjectives.flatMap(a => a.lexeme ?? [])
            .concat(noun?.lexeme ? [noun.lexeme] : [])
            .map(p => clauseOf(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), emptyClause)
            .and(complements.map(c => toClause(c, { subject: subjectId })).reduce((c1, c2) => c1.and(c2), emptyClause))
            .and(toClause(subClause, { subject: subjectId }))

    return res
}

function andSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const left = toClause(ast.links?.left, args)
    const right = toClause(ast?.links?.right?.list?.[0], args)

    if (ast.links?.left?.type === 'copula sentence') {
        return left.and(right)
    } else {
        const m = { [right.entities[0]]: left.entities[0] }
        const theme = left.theme.and(right.theme)
        const rheme = right.rheme.and(right.rheme.copy({ map: m }))
        return theme.and(rheme, { asRheme: true })
    }

}

function verbSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const subjId = args?.subject ?? getIncrementalId()
    const objId = getIncrementalId()

    const subject = toClause(ast.links?.subject, { subject: subjId })
    const object = toClause(ast.links?.object, { subject: objId })
    const verb = ast.links?.mverb?.lexeme ?? ast.links?.iverb?.lexeme

    if (!verb) {
        throw new Error('missing verb in verb sentence!')
    }

    const rheme = object === emptyClause ? clauseOf(verb, subjId) : clauseOf(verb, subjId, objId)

    return subject
        .and(object)
        .and(rheme, { asRheme: true })

}

function complexSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const subconj = ast.links?.subconj?.lexeme
    const condition = toClause(ast.links?.condition, args)
    const consequence = toClause(ast.links?.consequence, args)
    const c = condition.implies(consequence).copy({ subjconj: subconj })

    return c
}