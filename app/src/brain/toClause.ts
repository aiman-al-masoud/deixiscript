import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { getRandomId, Id, isVar, toConst, toVar } from "../clauses/Id";
import { getAnaphora } from "../enviro/Anaphora";
import { AstNode } from "../parser/interfaces/AstNode";



interface ToClauseOpts {
    subject?: Id
}

export function toClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    if (!ast) {
        throw new Error(`Ast is undefined!`)
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
    } else if (ast.type === 'and sentence') {
        result = andSentenceToClause(ast, args)
    } else if (ast.links?.subject && ast.links.object) {
        result = mverbSentenceToClause(ast, args)
    }

    if (result) {
        const c1 = makeAllVars(result)
        const c2 = resolveAnaphora(c1)
        const c3 = propagateVarsOwned(c2)
        return c3
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast.type}'!`)

}

function copulaSentenceToClause(copulaSentence: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getRandomId()
    const subject = toClause(copulaSentence?.links?.subject, { subject: subjectId })
    const predicate = toClause(copulaSentence?.links?.predicate, { subject: subjectId }).copy({ negate: !!copulaSentence?.links?.negation })
    const entities = subject.entities.concat(predicate.entities)

    const result = entities.some(e => isVar(e)) ?  // assume any sentence with any var is an implication
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true })

    return result.copy({ sideEffecty: true })

}

function copulaSubClauseToClause(copulaSubClause: AstNode, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause?.links?.predicate //as CompositeNode<CompositeType>

    return toClause(predicate, { subject: args?.subject })
        .copy({ sideEffecty: false })
}

function complementToClause(complement: AstNode, args?: ToClauseOpts): Clause {

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

function nounPhraseToClause(nounPhrase: AstNode, args?: ToClauseOpts): Clause {

    const maybeId = args?.subject ?? getRandomId()
    const subjectId = nounPhrase?.links?.uniquant ? toVar(maybeId) : maybeId

    const adjectives = nounPhrase?.links?.adjective?.list ?? []
    const noun = nounPhrase.links?.subject
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
    const m = a.query(clause.rheme)[0]
    const res = clause.copy({ map: m ?? {} })

    return res
}

function propagateVarsOwned(clause: Clause): Clause {// assume anything owned by a variable is also a variable

    const m = clause.entities
        .filter(e => isVar(e))
        .flatMap(e => clause.ownedBy(e))
        .map(e => ({ [e]: toVar(e) }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    return clause.copy({ map: m })

}


function andSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const left = toClause(ast.links?.left, args)
    const right = toClause(ast?.links?.right?.list?.[0], args)

    if (ast.links?.left?.type === 'copula sentence') {
        return left.and(right).copy({ sideEffecty: true })
    } else {
        const m = { [right.entities[0]]: left.entities[0] }
        const theme = left.theme.and(right.theme)
        const rheme = right.rheme.and(right.rheme.copy({ map: m }))
        return theme.and(rheme, { asRheme: true }).copy({ sideEffecty: true })
    }

}


function mverbSentenceToClause(ast: AstNode, args?: ToClauseOpts): Clause {

    const subjId = args?.subject ?? getRandomId()
    const objId = getRandomId()

    const subject = toClause(ast.links?.subject, { subject: subjId })
    const object = toClause(ast.links?.object, { subject: objId })
    const mverb = ast.links?.mverb?.lexeme

    if (!mverb) {
        throw new Error('no mverb in mverb sentence!')
    }

    const rheme = clauseOf(mverb, subjId, objId)
        .copy({ negate: !!ast.links.negation })

    const res = subject
        .and(object)
        .and(rheme, { asRheme: true })
        .copy({ sideEffecty: true })

    return res
}