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
import Imply from "./clauses/Imply"
import { wrap } from "../backend/wrapper/Thing"


interface ToClauseOpts {
    subject?: Id
}

export function evalAst(context: Context, ast?: AstNode, args?: ToClauseOpts): Clause {

    console.log(ast)

    let result
    let rel

    if (!ast) {
        result = emptyClause
    } else if (ast.lexeme) {
        result = evalLexeme(context, ast.lexeme, args)
    } else if (ast.list) {
        result = evalAstList(context, ast.list, args)
    } else if (ast?.links?.relpron && ast.links.copula) {
        result = evalCopulaSubClause(context, ast, args)
    } else if (ast?.links?.relpron && ast.links.mverb) {
        result = evalMverbSubClause(context, ast, args)
    } else if (ast?.links?.copula) {
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
        return adjustClause(result, !!ast?.links?.nonsubconj, !!ast?.links?.negation)
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast?.type}'!`)

}

function adjustClause(clause: Clause, hasAnd?: boolean, isNegated?: boolean): Clause {
    const c0 = hasAnd ? clause : makeImply(clause)
    const c1 = makeAllVars(c0)
    const c2 = resolveAnaphora(c1)
    const c3 = propagateVarsOwned(c2)
    const c4 = isNegated ? invertEffect(c3) : c3
    return c4
}

function evalLexeme(context: Context, lexeme: Lexeme, args?: ToClauseOpts): Clause {
    if (lexeme.type === 'noun' || lexeme.type === 'adjective' || lexeme.type === 'pronoun' || lexeme.type === 'grammar') {
        return clauseOf(lexeme, ...args?.subject ? [args?.subject] : [])
    } else {
        return emptyClause
    }
}

function evalAstList(context: Context, asts: AstNode[], args?: ToClauseOpts) {
    return asts.map(c => evalAst(context, c, args)).reduce((c1, c2) => c1.and(c2), emptyClause)
}

function evalCopulaSentence(context: Context, copulaSentence: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const subject = evalAst(context, copulaSentence?.links?.subject, { subject: subjectId })
    const predicate = evalAst(context, copulaSentence?.links?.predicate, { subject: subjectId })


    const maps1 = context.query(subject.theme)
    const maps = !maps1.length ? [{}] : maps1
    const clause = predicate.flatList()[0] //TODOOOOOOOOOOOOOOOOOO!!!!

    maps.forEach(m => { // TODO: imply vs single

        const argz = clause.args!
        const predicate = clause.predicate!

        const args = argz
            .map(id => m[id] ? context.get(m[id])! : context.set(wrap({ id: getIncrementalId() })))

        const subject = args[0]

        subject?.set(predicate, {
            args: args.slice(1),
            context,
            negated: clause.negated
        })

        if (!predicate.referent && predicate.type === 'noun') { // referent of "proper noun" is first to get it 
            predicate.referent ??= subject
            context.setLexeme(predicate)
        }

    })

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