import { Lexeme } from "../frontend/lexer/Lexeme"
import { AstNode } from "../frontend/parser/interfaces/AstNode"
import { Clause, emptyClause, clauseOf } from "./clauses/Clause"
import { makeAllVars } from "./clauses/functions/makeAllVars"
import { makeImply } from "./clauses/functions/makeImply"
import { invertEffect } from "./clauses/functions/invertEffect"
import { propagateVarsOwned } from "./clauses/functions/propagateVarsOwned"
import { resolveAnaphora } from "./clauses/functions/resolveAnaphora"
import { getIncrementalId } from "./id/functions/getIncrementalId"
import { toVar } from "./id/functions/toVar"
import { Id } from "./id/Id"
import { Context } from "../facade/context/Context"


interface ToClauseOpts {
    subject?: Id
}

export function evalAst(context: Context, ast?: AstNode, args?: ToClauseOpts): Clause {

    console.log(ast)

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
        return ast.list.map(c => evalAst(context, c, args)).reduce((c1, c2) => c1.and(c2), emptyClause)
    }


    let result
    let rel

    if (ast?.links?.relpron && ast.links.copula) {
        result = evalCopulaSubClause(context, ast, args)
    } else if (ast?.links?.relpron && ast.links.mverb) {
        result = evalMverbSubClause(context, ast, args)
    } else if (isCopulaSentence(ast)) {
        result = evalCopulaSentence(context, ast, args)
    } else if (ast.links?.nonsubconj) {
        result = evalAndSentence(context, ast, args)
    } else if (rel = ast.links?.iverb?.lexeme || ast.links?.mverb?.lexeme || ast.links?.preposition?.lexeme) {
        result = evalRelation(context, ast, rel, args)
    } else if (ast.links?.subconj) {
        result = evalComplexSentence(context, ast, args)
    } else {
        result = evalNounPhrase(context, ast, args)
    }


    if (result) {
        const c0 = ast.links?.nonsubconj ? result : makeImply(result)
        const c1 = makeAllVars(c0)
        const c2 = resolveAnaphora(c1)
        const c3 = propagateVarsOwned(c2)
        const c4 = ast?.links?.negation ? invertEffect(c3) : c3
        return c4
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast.type}'!`)

}

const isCopulaSentence = (ast?: AstNode) => !!ast?.links?.copula

function evalCopulaSentence(context: Context, copulaSentence: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const subject = evalAst(context, copulaSentence?.links?.subject, { subject: subjectId })
    const predicate = evalAst(context, copulaSentence?.links?.predicate, { subject: subjectId })

    return subject.and(predicate, { asRheme: true })
}

function evalCopulaSubClause(context: Context, copulaSubClause: AstNode, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause?.links?.predicate
    return evalAst(context, predicate, args)
}

function evalMverbSubClause(context: Context, ast: AstNode, args?: ToClauseOpts)/* :Clause */ {

    const mverb = ast.links?.mverb?.lexeme!
    const subjectId = args?.subject!
    const objectId = getIncrementalId()
    const object = evalAst(context, ast.links?.object, { subject: objectId }) // 

    return object.and(clauseOf(mverb, subjectId, objectId))

}

function evalNounPhrase(context: Context, nounPhrase: AstNode, opts?: ToClauseOpts): Clause {

    const maybeId = opts?.subject ?? getIncrementalId()
    const subjectId = nounPhrase?.links?.uniquant ? toVar(maybeId) : maybeId
    const args = { subject: subjectId }

    return Object.values(nounPhrase.links ?? {})
        .map(x => evalAst(context, x, args)).reduce((a, b) => a.and(b), emptyClause)

}

function evalRelation(context: Context, ast: AstNode, rel: Lexeme, opts?: ToClauseOpts): Clause {

    const subjId = opts?.subject ?? getIncrementalId()
    const objId = getIncrementalId()

    const subject = evalAst(context, ast.links?.subject, { subject: subjId })
    const object = evalAst(context, ast.links?.object, { subject: objId })

    const args = object === emptyClause ? [subjId] : [subjId, objId]
    const relation = clauseOf(rel, ...args)
    const relationIsRheme = subject !== emptyClause

    return subject
        .and(object)
        .and(relation, { asRheme: relationIsRheme })

}

function evalComplexSentence(context: Context, ast: AstNode, args?: ToClauseOpts): Clause {

    const subconj = ast.links?.subconj?.lexeme
    const condition = evalAst(context, ast.links?.condition, args)
    const consequence = evalAst(context, ast.links?.consequence, args)
    return condition.implies(consequence).copy({ subjconj: subconj })

}

function evalAndSentence(context: Context, ast: AstNode, args?: ToClauseOpts): Clause {

    const left = evalAst(context, ast.links?.left, args)
    const right = evalAst(context, ast?.links?.right?.list?.[0], args)

    if (ast.links?.left?.type === ast.links?.right?.type) {
        return left.and(right)
    } else {
        const m = { [right.entities[0]]: left.entities[0] }
        const theme = left.theme.and(right.theme)
        const rheme = right.rheme.and(right.rheme.copy({ map: m }))
        return theme.and(rheme, { asRheme: true })
    }

}