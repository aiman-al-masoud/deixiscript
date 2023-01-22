import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { getRandomId, Id, isVar, toConst, toVar } from "../clauses/Id";
import { getAnaphora } from "../enviro/Anaphora";
import { AstNode, AstType, AtomNode, CompositeNode } from "./ast-types";
import { LexemeType } from "../config/LexemeType";
import { ConstituentType } from "../config/syntaxes";

// start simple by assuming hardcoded types, then try to depend solely on role (semantic role)

export interface Roles {
    subject?: Id
    object?: Id
}

export interface ToClauseOpts {
    roles?: Roles,
    anaphora?: Clause
}

export function toClause(ast: AstNode<AstType>, args?: ToClauseOpts): Clause {

    const cast = ast as CompositeNode<ConstituentType>

    if (cast.links.noun || cast.links.adj) {
        return nounPhraseToClause(ast as any, args)
    } else if (cast.links.relpron) {
        return copulaSubClauseToClause(ast as any, args)
    } else if (cast.links.preposition) {
        return complementToClause(ast as any, args)
    } else if (cast.links.subject && cast.links.predicate) {
        return copulaSentenceToClause(ast as any, args)
    }

    console.log({ ast })
    throw new Error(`Idk what to do with ${ast.type}!`)

}

function copulaSentenceToClause(copulaSentence: any, args?: ToClauseOpts): Clause {

    const subjectAst = copulaSentence.links.subject as CompositeNode<ConstituentType>
    const predicateAst = copulaSentence.links.predicate as CompositeNode<ConstituentType>
    const subjectId = args?.roles?.subject ?? getRandomId({ asVar: subjectAst.links.uniquant !== undefined })
    const newArgs = { ...args, roles: { subject: subjectId } }
    const subject = toClause(subjectAst, newArgs)
    const predicate = toClause(predicateAst, newArgs).copy({ negate: !!copulaSentence.links.negation })
    const entities = subject.entities.concat(predicate.entities)

    const result = entities// assume any sentence with any var is an implication
        .some(e => isVar(e)) ?
        subject.implies(predicate) :
        subject.and(predicate, { asRheme: true })

    const m0 = result.entities // assume ids are case insensitive, assume if IDX is var all idx are var
        .filter(x => isVar(x))
        .map(e => ({ [toConst(e)]: e }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    const a = getAnaphora() // get anaphora
    a.assert(subject)
    const m1 = (a.query(predicate))[0] ?? {}
    const result2 = result.copy({ map: m0 }).copy({ sideEffecty: true, map: m1 })

    const m2 = result2.entities // assume anything owned by a variable is also a variable
        .filter(e => isVar(e))
        .flatMap(e => result2.ownedBy(e))
        .map(e => ({ [e]: toVar(e) }))
        .reduce((a, b) => ({ ...a, ...b }), {})

    return result2.copy({ map: m2 })

}

function copulaSubClauseToClause(copulaSubClause: any, args?: ToClauseOpts): Clause {

    const predicate = copulaSubClause.links.predicate as CompositeNode<ConstituentType>

    return (toClause(predicate, { ...args, roles: { subject: args?.roles?.subject } }))
        .copy({ sideEffecty: false })
}

function complementToClause(complement: any, args?: ToClauseOpts): Clause {
    const subjId = args?.roles?.subject ?? ((): Id => { throw new Error('undefined subject id') })()
    const newId = getRandomId()

    const preposition = complement.links.preposition as AtomNode<'preposition'>
    const nounPhrase = complement.links.nounphrase as CompositeNode<ConstituentType>

    return clauseOf(preposition.lexeme, subjId, newId)
        .and(toClause(nounPhrase, { ...args, roles: { subject: newId } }))
        .copy({ sideEffecty: false })

}


function nounPhraseToClause(nounPhrase: CompositeNode<ConstituentType>, args?: ToClauseOpts): Clause {

    const maybeId = args?.roles?.subject ?? getRandomId()
    const subjectId = nounPhrase.links.uniquant ? toVar(maybeId) : maybeId
    const newArgs = { ...args, roles: { subject: subjectId } };

    const adjectives: AtomNode<LexemeType>[] = (nounPhrase?.links?.adj as any)?.links ?? []
    const noun = nounPhrase.links.noun as AtomNode<LexemeType> | undefined
    const complements: AtomNode<LexemeType>[] = (nounPhrase?.links?.complement as any)?.links ?? []
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
