import { Context } from "../backend/Context";
import { InstructionThing } from "../backend/InstructionThing";
import { NumberThing } from "../backend/NumberThing";
import { StringThing } from "../backend/StringThing";
import { Thing, getThing } from "../backend/Thing";
import { isPlural, Lexeme } from "../frontend/lexer/Lexeme";
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { parseNumber } from "../utils/parseNumber";
import { Clause, clauseOf, emptyClause } from "./clauses/Clause";
import { getIncrementalId } from "./id/functions/getIncrementalId";
import { Id } from "./id/Id";
import { Map } from "./id/Map";

export function evalAst(context: Context, ast: AstNode, args: ToClauseOpts = {}): Thing[] { //TODO: option to disable side effects (for example for if condition)

    args.sideEffects ??= couldHaveSideEffects(ast)

    if (args.sideEffects) { // only cache instructions with side effects
        const instruction = new InstructionThing(ast)
        context.set(instruction.getId(), instruction)
        context.setLexeme({ root: 'instruction', type: 'noun', referents: [instruction] })
    }

    if (ast?.links?.copula) {
        return evalCopulaSentence(context, ast, args)
    } else if (ast?.links?.verb) {
        return evalVerbSentence(context, ast, args)
    } else if (ast?.links?.subconj) {
        return evalComplexSentence(context, ast, args)
    } else if (ast?.links?.nonsubconj) {
        return evalCompoundSentence(context, ast, args)
    } else if (ast?.links?.quote) {
        return evalString(context, ast, args)
    } else {
        return evalNounPhrase(context, ast, args)
    }

}


function evalCopulaSentence(context: Context, ast: AstNode, args?: ToClauseOpts): Thing[] {

    //TODO assigment or comparison, based on args.sideEffects

    if (args?.sideEffects) {
        // assign the right value to the left value
    } else {
        // compare the right and left values
    }

    throw new Error('copula sentence!')

    // const subjectId = args?.subject ?? getIncrementalId()

    // const maybeSubject = evalAst(context, ast?.links?.subject)
    // const subject = nounPhraseToClause(ast?.links?.subject)
    // const predicate = evalAst(context, ast?.links?.predicate, { subject: subjectId, autovivification: true, sideEffects: false })

    // if (maybeSubject.length) {
    //     return maybeSubject // TODO
    // }

    // const newThing = predicate[0]
    // const lexemes: Lexeme[] = subject.flatList().filter(x => x.predicate).map(x => x.predicate!).map(x => ({ ...x, referents: [newThing] }))
    // context.set(newThing.getId(), newThing)
    // lexemes.forEach(x => context.setLexeme(x))

    // return [newThing]
}

function evalVerbSentence(context: Context, ast: AstNode, args?: ToClauseOpts): Thing[] {
    throw new Error('verb sentence!')// context.getLexeme(ast?.links?.mverb?.lexeme?.root!)
}

function evalComplexSentence(context: Context, ast: AstNode, args?: ToClauseOpts): Thing[] {
    throw new Error('complex sentence!')
}

function evalCompoundSentence(context: Context, ast: AstNode, args?: ToClauseOpts): Thing[] {
    throw new Error('compound sentence!')
}

function evalNounPhrase(context: Context, ast: AstNode, args?: ToClauseOpts): Thing[] {

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

    if (isAstPlural(ast)) { // if universal quantified, I don't care if there's no match
        return things
    }

    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1)
    }

    // or else create and returns the Thing
    return args?.autovivification ? [createThing(np)] : []

}

function nounPhraseToClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const adjectives = (ast?.links?.adjective?.list ?? []).map(x => x.lexeme!).filter(x => x).map(x => clauseOf(x, subjectId)).reduce((a, b) => a.and(b), emptyClause)
    const nouns = (ast?.links?.subject?.list ?? []).map(x => x.lexeme!).filter(x => x).map(x => clauseOf(x, subjectId)).reduce((a, b) => a.and(b), emptyClause)
    const complements = Object.values(ast?.links ?? {}).filter(x => x.list).flatMap(x => x.list!).filter(x => x.links?.preposition).map(x => complementToClause(x, { subject: subjectId, autovivification: false, sideEffects: false })).reduce((a, b) => a.and(b), emptyClause)

    return adjectives.and(nouns).and(complements)
    //TODO: subclause

}

function complementToClause(ast?: AstNode, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject!
    const objectId = getIncrementalId()
    const preposition = ast?.links?.preposition?.lexeme!
    const object = nounPhraseToClause(ast?.links?.object, { subject: objectId, autovivification: false, sideEffects: false })

    return clauseOf(preposition, subjectId, objectId).and(object)

}

function relativeClauseToClause(ast?: AstNode, args?: ToClauseOpts): Clause {
    return emptyClause //TODO!
}

function isAstPlural(ast?: AstNode): boolean {

    const x =
        ast?.links?.noun?.list?.some(x => x.lexeme && isPlural(x.lexeme))
        || ast?.links?.adjective?.list?.some(x => x.lexeme && isPlural(x.lexeme))
        || ast?.links?.subject?.list?.some(x => x.lexeme && isPlural(x.lexeme))
        || ast?.links?.uniquant

    if (x) {
        return true
    }

    return Object.values(ast?.links ?? {}).concat(ast?.list ?? []).some(x => isAstPlural(x))
}

function getInterestingIds(maps: Map[]): Id[] {

    // the ones with most dots, because "color of style of button" 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if "color of button AND button"
    const ids = maps.flatMap(x => Object.values(x))
    const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    return ids.filter(x => getNumberOfDots(x) === maxLen)

}

const getNumberOfDots = (id: Id) => id.split('.').length //-1

function createThing(clause: Clause): Thing {
    const bases = clause.flatList().map(x => x.predicate?.referents?.[0]!)/* ONLY FIRST? */.filter(x => x)
    const id = getIncrementalId()
    return getThing({ id, bases })
}

function evalString(context: Context, ast?: AstNode, args?: ToClauseOpts): Thing[] {
    const x = Object.values({ ...ast?.links, 'quote': undefined }).filter(x => x).at(0)?.list?.map(x => x.lexeme?.token) ?? []
    const y = x.join(' ')
    const z = parseNumber(y)

    if (z) {
        return [new NumberThing(z)]
    }

    if (!y.length) {
        return []
    }

    return [new StringThing(y)]
}

function couldHaveSideEffects(ast: AstNode) { // anything that is not a nounphrase COULD have side effects
    return !!(ast.links?.copula || ast.links?.verb || ast.links?.subconj)
}

interface ToClauseOpts {
    subject?: Id,
    autovivification?: boolean,
    sideEffects?: boolean,
}