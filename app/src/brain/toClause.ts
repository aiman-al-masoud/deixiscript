import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { getRandomId, Id, isVar, toConst, toVar } from "../clauses/Id";
import { getAnaphora } from "../enviro/Anaphora";
import { AstNode, LeafNode, CompositeNode } from "../parser/interfaces/AstNode";
import { LexemeType } from "../config/LexemeType";
import { CompositeType } from "../config/syntaxes";
import { AstType } from "../parser/interfaces/Syntax";



interface ToClauseOpts {
    subject?: Id
}

export function toClause(ast: AstNode<AstType>, args?: ToClauseOpts): Clause {

    const cast = ast as CompositeNode<CompositeType>
    let result

    if (cast.links.pronoun || cast.links.noun || cast.links.adjective) {
        result = nounPhraseToClause(ast as any, args)
    } else if (cast.links.relpron) {
        result = copulaSubClauseToClause(ast as any, args)
    } else if (cast.links.preposition) {
        result = complementToClause(ast as any, args)
    } else if (cast.links.subject && cast.links.predicate) {
        result = copulaSentenceToClause(ast as any, args)
    }

    if (result) {
        return propagateVarsOwned(resolveAnaphora(makeAllVars(result)))
    }

    console.log({ ast })
    throw new Error(`Idk what to do with '${ast.type}'!`)

}

function copulaSentenceToClause(copulaSentence: any, args?: ToClauseOpts): Clause {

    const subjectAst = copulaSentence.links.subject as CompositeNode<CompositeType>
    const predicateAst = copulaSentence.links.predicate as CompositeNode<CompositeType>
    const subjectId = args?.subject ?? getRandomId({ asVar: subjectAst.links.uniquant !== undefined })
    const newArgs = { ...args, subject: subjectId }
    const subject = toClause(subjectAst, newArgs)
    const predicate = toClause(predicateAst, newArgs).copy({ negate: !!copulaSentence.links.negation })
    const entities = subject.entities.concat(predicate.entities)

    const result = entities.some(e => isVar(e)) ?  // assume any sentence with any var is an implication
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true })

    return result.copy({ sideEffecty: true })

}

function copulaSubClauseToClause(copulaSubClause: any, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause.links.predicate as CompositeNode<CompositeType>

    return toClause(predicate, { ...args, subject: args?.subject })
        .copy({ sideEffecty: false })
}

function complementToClause(complement: any, args?: ToClauseOpts): Clause {

    const subjId = args?.subject ?? getRandomId() //?? ((): Id => { throw new Error('undefined subject id') })()
    const newId = getRandomId()

    const preposition = complement.links.preposition as LeafNode<'preposition'>
    const nounPhrase = complement.links['noun phrase'] as CompositeNode<CompositeType>

    return clauseOf(preposition.lexeme, subjId, newId)
        .and(toClause(nounPhrase, { ...args, subject: newId }))
        .copy({ sideEffecty: false })

}

function nounPhraseToClause(nounPhrase: CompositeNode<CompositeType>, args?: ToClauseOpts): Clause {

    const maybeId = args?.subject ?? getRandomId()
    const subjectId = nounPhrase.links.uniquant ? toVar(maybeId) : maybeId
    const newArgs = { ...args, roles: { subject: subjectId } };

    const adjectives: LeafNode<LexemeType>[] = (nounPhrase?.links?.adjective as any)?.links ?? []
    const noun = (nounPhrase.links.noun ?? nounPhrase.links.pronoun) as LeafNode<LexemeType> | undefined
    const complements: LeafNode<LexemeType>[] = (nounPhrase?.links?.complement as any)?.links ?? []
    const subClause = nounPhrase.links.subclause

    const res =
        adjectives.map(a => a.lexeme)
            .concat(noun?.lexeme ? [noun.lexeme] : [])
            .map(p => clauseOf(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), emptyClause())
            .and(complements.map(c => c ? toClause(c, newArgs) : emptyClause()).reduce((c1, c2) => c1.and(c2), emptyClause()))
            .and(subClause ? toClause(subClause, newArgs) : emptyClause())
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