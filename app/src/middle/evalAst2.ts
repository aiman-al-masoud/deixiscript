import Thing, { wrap } from "../backend/wrapper/Thing";
import { Context } from "../facade/context/Context";
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { Clause, clauseOf, emptyClause } from "./clauses/Clause";
import { getIncrementalId } from "./id/functions/getIncrementalId";
import { Id } from "./id/Id";
import { Map } from "./id/Map";

export function evalAst2(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {

    if (ast?.links?.copula) {
        return evalCopulaSentence(context, ast, args)
    } else if (ast?.links?.iverb?.lexeme || ast?.links?.mverb?.lexeme) {
        return evalVerbSentence(context, ast, args)
    } else if (ast?.links?.subconj) {
        return evalComplexSentence(context, ast, args)
    } else if (ast?.links?.nonsubconj) {
        return evalCompoundSentence(context, ast, args)
    } else {
        return evalNounPhrase(context, ast, args)  //nounphrase is the "atom"
    }
}


function evalCopulaSentence(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {


    const subjectId = args?.subject ?? getIncrementalId()
    const subject = evalAst2(context, ast?.links?.subject, { subject: subjectId, autovivification: true })
    const predicate = evalAst2(context, ast?.links?.predicate, { subject: subjectId, autovivification: false })

    subject.forEach(s => {
        predicate.forEach(p => { // potential problem: getting predicates separately
            s.set2(p, [], !!ast?.links?.negation, context)
        })
    })

    subject.forEach(s => context.set(s))

    return []//TODO
}

function evalVerbSentence(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {
    throw 'TODO!'
}

function evalComplexSentence(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {
    throw 'TODO!'
}

function evalCompoundSentence(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {
    throw 'TODO!'
}

function evalNounPhrase(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {

    const np = nounPhraseToClause(ast, args)

    // checks for Things that match given nounphrase
    // 1. in current sentence scope
    // 2. in broader context
    const currentScope = ((context as any).currentScope as Clause) ?? emptyClause
    const maps = currentScope.query(np).concat(context.query(np));                  // const np2 = np.copy({map : maps[0] ?? {}});
    const interestingIds = getInterestingIds(maps);

    // TMP (only) use context to pass around data about "currrent sentence", yuck! POSSIBLE BUGS!
    (context as any).currentScope = np

    const things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x as Thing);

    if (isPlural(ast)) { // if universal quantified, I don't care if there's no match
        return things
    }

    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1)
    }

    // or else create and returns the Thing
    return args?.autovivification ? [createThingExNovo(context, np)] : []

}

function nounPhraseToClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const adjectives = (ast?.links?.adjective?.list ?? []).map(x => x.lexeme!).filter(x => x).map(x => clauseOf(x, subjectId)).reduce((a, b) => a.and(b), emptyClause)
    const nouns = (ast?.links?.subject?.list ?? []).map(x => x.lexeme!).filter(x => x).map(x => clauseOf(x, subjectId)).reduce((a, b) => a.and(b), emptyClause)
    const complements = Object.values(ast?.links ?? {}).filter(x => x.list).flatMap(x => x.list!).filter(x => x.links?.preposition).map(x => complementToClause(x, { subject: subjectId, autovivification: false })).reduce((a, b) => a.and(b), emptyClause)

    return adjectives.and(nouns).and(complements)
    //TODO: subclause

}

function complementToClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject!
    const objectId = getIncrementalId()
    const preposition = ast?.links?.preposition?.lexeme!
    const object = nounPhraseToClause(ast?.links?.object, { subject: objectId, autovivification: false })

    return clauseOf(preposition, subjectId, objectId).and(object)

}

function relativeClauseToClause(ast?: AstNode, args?: ToClauseOpts): Clause {
    return emptyClause //TODO!
}

function isPlural(ast?: AstNode) {

    return ast?.links?.noun?.lexeme?.isPlural
        || ast?.links?.adjective?.lexeme?.isPlural
        || ast?.links?.noun?.list?.some(x => x.lexeme?.isPlural)
        || ast?.links?.adjective?.list?.some(x => x.lexeme?.isPlural)
        || ast?.links?.uniquant

}

function getInterestingIds(maps: Map[]): Id[] {

    // the ones with most dots, because "color of style of button" 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if "color of button AND button"
    const ids = maps.flatMap(x => Object.values(x))
    const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    return ids.filter(x => getNumberOfDots(x) === maxLen)

}

const getNumberOfDots = (id: Id) => id.split('.').length

function createThingExNovo(context: Context, clause: Clause): Thing {
    const thing = wrap({ id: getIncrementalId() })
    clause.flatList().forEach(c => {
        thing.set(c.predicate!, { negated: clause.negated, context }) //set2
    })//TODO: don't add to context? implicitly added by thing.set() inherit
    return thing
}

interface ToClauseOpts {
    subject?: Id,
    autovivification: boolean,
}