import { Lexeme } from "../frontend/lexer/Lexeme"
import { AstNode } from "../frontend/parser/interfaces/AstNode"
import { Clause, emptyClause, clauseOf } from "./clauses/Clause"
import { makeAllVars } from "./clauses/functions/makeAllVars"
import { makeImply } from "./clauses/functions/makeImply"
import { negate } from "./clauses/functions/negate"
import { propagateVarsOwned } from "./clauses/functions/propagateVarsOwned"
import { resolveAnaphora } from "./clauses/functions/resolveAnaphora"
import { getIncrementalId } from "./id/functions/getIncrementalId"
import { toVar } from "./id/functions/toVar"
import { Id } from "./id/Id"


interface ToClauseOpts {
    subject?: Id
}

export function toClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    if (!ast) {
        // console.warn('Ast is undefined!')
        return emptyClause
    }

    if (ast.lexeme) {

        if (ast.lexeme.type === 'noun' || ast.lexeme.type === 'adjective' || ast.lexeme.type === 'pronoun' || ast.lexeme.type === 'grammar') {
            return clauseOf(ast.lexeme, ...args?.subject ? [args?.subject] : [])
        }

        return emptyClause

    }

    if (ast.list) {
        return ast.list.map(c => toClause(c, args)).reduce((c1, c2) => c1.and(c2), emptyClause)
    }


    let result
    let rel

    if (ast?.links?.relpron && ast.links.copula) {
        result = copulaSubClauseToClause(ast, args)
    } else if (ast?.links?.relpron && ast.links.mverb) {
        result = mverbSubClauseToClause(ast, args)
    } else if (isCopulaSentence(ast)) {
        result = copulaSentenceToClause(ast, args)
    } else if (ast.links?.nonsubconj) {
        result = andSentenceToClause(ast, args)
    } else if (rel = ast.links?.iverb?.lexeme || ast.links?.mverb?.lexeme || ast.links?.preposition?.lexeme) {
        result = relationToClause(ast, rel, args)
    } else if (ast.links?.subconj) {
        result = complexSentenceToClause(ast, args)
    } else {
        result = nounPhraseToClause(ast, args)
    }


    if (result) {
        const c0 = ast.links?.nonsubconj ? result : makeImply(result)
        const c1 = makeAllVars(c0)
        const c2 = resolveAnaphora(c1)
        const c3 = propagateVarsOwned(c2)
        const c4 = negate(c3, !!ast?.links?.negation)
        return c4
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast.type}'!`)

}

const isCopulaSentence = (ast?: AstNode) => !!ast?.links?.copula

function copulaSentenceToClause(copulaSentence: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const subject = toClause(copulaSentence?.links?.subject, { subject: subjectId })
    const predicate = toClause(copulaSentence?.links?.predicate, { subject: subjectId })

    return subject.and(predicate, { asRheme: true })
}

function copulaSubClauseToClause(copulaSubClause: AstNode, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause?.links?.predicate
    return toClause(predicate, args)
}

function mverbSubClauseToClause(ast: AstNode, args?: ToClauseOpts)/* :Clause */ {

    const mverb = ast.links?.mverb?.lexeme!
    const subjectId = args?.subject!
    const objectId = getIncrementalId()
    const object = toClause(ast.links?.object, { subject: objectId }) // 

    return object.and(clauseOf(mverb, subjectId, objectId))

}

function nounPhraseToClause(nounPhrase: AstNode, opts?: ToClauseOpts): Clause {

    const maybeId = opts?.subject ?? getIncrementalId()
    const subjectId = nounPhrase?.links?.uniquant ? toVar(maybeId) : maybeId
    const args = { subject: subjectId }

    return Object.values(nounPhrase.links ?? {})
        .map(x => toClause(x, args)).reduce((a, b) => a.and(b), emptyClause)

}

function relationToClause(ast: AstNode, rel: Lexeme, opts?: ToClauseOpts): Clause {

    const subjId = opts?.subject ?? getIncrementalId()
    const objId = getIncrementalId()

    const subject = toClause(ast.links?.subject, { subject: subjId })
    const object = toClause(ast.links?.object, { subject: objId })

    const args = object === emptyClause ? [subjId] : [subjId, objId]
    const relation = clauseOf(rel, ...args)
    const relationIsRheme = subject !== emptyClause

    return subject
        .and(object)
        .and(relation, { asRheme: relationIsRheme })

}

function complexSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const subconj = ast.links?.subconj?.lexeme
    const condition = toClause(ast.links?.condition, args)
    const consequence = toClause(ast.links?.consequence, args)
    return condition.implies(consequence).copy({ subjconj: subconj })

}

function andSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const left = toClause(ast.links?.left, args)
    const right = toClause(ast?.links?.right?.list?.[0], args)

    if (ast.links?.left?.type === ast.links?.right?.type) {
        return left.and(right)
    } else {
        const m = { [right.entities[0]]: left.entities[0] }
        const theme = left.theme.and(right.theme)
        const rheme = right.rheme.and(right.rheme.copy({ map: m }))
        return theme.and(rheme, { asRheme: true })
    }

}