
import { isPlural, Lexeme, makeLexeme } from '../../frontend/lexer/Lexeme';
import { AndPhrase, AstNode, ComplexSentence, Macro, Macropart, NounPhrase, NumberLiteral, StringLiteral, SimpleSentence } from '../../frontend/parser/interfaces/AstNode';
import { parseNumber } from '../../utils/parseNumber';
import { Clause, clauseOf, emptyClause } from '../../middle/clauses/Clause';
import { getOwnershipChain } from '../../middle/clauses/functions/getOwnershipChain';
import { getIncrementalId } from '../../middle/id/functions/getIncrementalId';
import { Id } from '../../middle/id/Id';
import { Map } from '../../middle/id/Map';
import { Context } from '../things/Context';
import { InstructionThing } from '../things/InstructionThing';
import { NumberThing } from '../things/NumberThing';
import { StringThing } from '../things/StringThing';
import { Thing, getThing } from '../things/Thing';
import { VerbThing } from '../things/VerbThing';
import { Member, AstType } from '../../frontend/parser/interfaces/Syntax';


export function evalAst(context: Context, ast: AstNode, args: ToClauseOpts = {}): Thing[] {

    args.sideEffects ??= couldHaveSideEffects(ast)

    if (args.sideEffects) { // only cache instructions with side effects
        const instruction = new InstructionThing(ast)
        context.set(instruction.getId(), instruction)
        context.setLexeme(makeLexeme({ root: 'instruction', type: 'noun', referents: [instruction] }))
    }

    if (ast.type === 'macro') {
        return evalMacro(context, ast)
    } else if (ast.type === 'simple-sentence' && ast.verborcopula.type === 'copula') {
        return evalCopulaSentence(context, ast, args)
    } else if (ast.type === 'simple-sentence' && ast.verborcopula.type === 'verb') {
        return evalVerbSentence(context, ast, args)
    } else if (ast.type === 'complex-sentence') {
        return evalComplexSentence(context, ast, args)
    } else if (ast.type === 'noun-phrase') {
        return evalNounPhrase(context, ast, args)
    }

    console.warn(ast)
    throw new Error('evalAst() got unexpected ast type: ' + ast.type)

}


function evalCopulaSentence(context: Context, ast: SimpleSentence, args?: ToClauseOpts): Thing[] {

    if (args?.sideEffects) { // assign the right value to the left value

        const subjectId = args?.subject ?? getIncrementalId()
        const subject = nounPhraseToClause(ast.subject, { subject: subjectId }).simple
        const rVal = evalAst(context, ast.object!, { subject: subjectId })
        const ownerChain = getOwnershipChain(subject)
        const maps = context.query(subject)
        const lexemes = subject.flatList().map(x => x.predicate!).filter(x => x)
        const lexemesWithReferent = lexemes.map(x => ({ ...x, referents: rVal }))

        // ast.subject?.owner // TODO: use NounPhrase.owner maybe!?

        if (rVal.every(x => x instanceof InstructionThing)) { // make verb from instructions
            const verb = new VerbThing(getIncrementalId(), rVal as InstructionThing[])
            context.set(verb.getId(), verb)
            const lexemesWithReferent: Lexeme[] = lexemes.map(x => ({ ...x, referents: [verb], type: 'verb' }))
            lexemesWithReferent.forEach(x => context.setLexeme(x))
            return [verb]
        }

        if (!maps.length && ownerChain.length <= 1) { // lVal is completely new
            lexemesWithReferent.forEach(x => context.setLexeme(x))
            rVal.forEach(x => context.set(x.getId(), x))
            return rVal
        }

        if (maps.length && ownerChain.length <= 1) { // reassignment
            lexemes.forEach(x => context.removeLexeme(x.root))
            lexemesWithReferent.forEach(x => context.setLexeme(x))
            rVal.forEach(x => context.set(x.getId(), x))
            return rVal
        }

        if (ownerChain.length > 1) { // lVal is property of existing object
            const aboutOwner = about(subject, ownerChain.at(-2)!)
            const owners = getInterestingIds(context.query(aboutOwner), aboutOwner).map(id => context.get(id)!).filter(x => x)
            const owner = owners.at(0)
            const rValClone = rVal.map(x => x.clone({ id: owner?.getId() + '.' + x.getId() }))
            const lexemesWithCloneReferent = lexemes.map(x => ({ ...x, referents: rValClone }))
            lexemesWithCloneReferent.forEach(x => context.setLexeme(x))
            rValClone.forEach(x => owner?.set(x.getId(), x))
            return rValClone
        }

    } else { // compare the right and left values
        const subject = evalAst(context, ast.subject!, args).at(0)
        const predicate = evalAst(context, ast.object!, args).at(0)
        return subject?.equals(predicate!) && (!ast.negation) ? [new NumberThing(1)] : []
    }

    console.warn('problem with copula sentence!')
    return []
}

function about(clause: Clause, entity: Id) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), emptyClause).simple
}

function evalVerbSentence(context: Context, ast: SimpleSentence, args?: ToClauseOpts): Thing[] { //TODO: multiple subjects/objects

    const verb = ast.verborcopula.referents.at(0) as VerbThing | undefined
    const subject = ast.subject ? evalAst(context, ast.subject).at(0) : undefined
    const object = ast.object ? evalAst(context, ast.object).at(0) : undefined

    // console.log('verb=', verb)
    // console.log('subject=', subject)
    // console.log('object=', object)
    // console.log('complements=', complements)

    if (!verb) {
        throw new Error('no such verb ' + ast.verborcopula.root)
    }

    return verb.run(context, { subject: subject ?? context, object: object ?? context })
}

function evalComplexSentence(context: Context, ast: ComplexSentence, args?: ToClauseOpts): Thing[] {

    if (ast.subconj.root === 'if') {

        if (evalAst(context, ast.condition, { ...args, sideEffects: false }).length) {
            evalAst(context, ast.consequence, { ...args, sideEffects: true })
        }

    }

    return []
}

function evalNounPhrase(context: Context, ast: NounPhrase, args?: ToClauseOpts): Thing[] {

    const np = nounPhraseToClause(ast, args)
    const maps = context.query(np) // TODO: intra-sentence anaphora resolution
    const interestingIds = getInterestingIds(maps, np)
    let things: Thing[]
    const andPhrase = ast['and-phrase'] ? evalAst(context, ast['and-phrase']?.['noun-phrase'], args) : []

    if (ast.subject.type === 'number-literal') {
        things = andPhrase.concat(evalNumberLiteral(ast.subject))
    } else if (ast.subject.type === 'string') {
        things = evalString(context, ast.subject, args).concat(andPhrase)
    } else {
        things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x!) // TODO sort by id
    }

    if (ast['math-expression']) {
        const left = things
        const op = ast['math-expression'].operator
        const right = evalAst(context, ast['math-expression']?.['noun-phrase'])
        return evalOperation(left, right, op)
    }

    if (isAstPlural(ast) || ast['and-phrase']) { // if universal quantified, I don't care if there's no match
        const limit = ast['limit-phrase']?.['number-literal']
        const limitNum = evalNumberLiteral(limit).at(0)?.toJs() ?? things.length
        return things.slice(0, limitNum)
    }

    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1)
    }

    // or else create and returns the Thing
    return args?.autovivification ? [createThing(np)] : []

}

function evalNumberLiteral(ast?: NumberLiteral): NumberThing[] {

    if (!ast) {
        return []
    }

    const digits = ast.digit.list.map(x => x.root) ?? []
    const literal = digits.reduce((a, b) => a + b, '')

    const z = parseNumber(literal)

    if (z) {
        return [new NumberThing(z)]
    }

    return []
}


function evalOperation(left: Thing[], right: Thing[], op?: Lexeme) {
    const sums = left.map(x => x.toJs() as any + right.at(0)?.toJs())
    return sums.map(x => new NumberThing(x))
}

function nounPhraseToClause(ast?: NounPhrase, args?: ToClauseOpts): Clause {

    const subjectId = args?.subject ?? getIncrementalId()
    const adjectives = (ast?.adjective?.list ?? []).map(x => x!).filter(x => x).map(x => clauseOf(x, subjectId)).reduce((a, b) => a.and(b), emptyClause)

    let noun = emptyClause

    if (ast?.subject.type === 'noun' || ast?.subject.type === 'pronoun') {
        noun = clauseOf(ast.subject, subjectId)
    }

    const genitiveComplement = genitiveToClause(ast?.owner, { subject: subjectId, autovivification: false, sideEffects: false })
    const andPhrase = evalAndPhrase(ast?.['and-phrase'], args)

    return adjectives.and(noun).and(genitiveComplement).and(andPhrase)
}

function evalAndPhrase(andPhrase?: AndPhrase, args?: ToClauseOpts) {

    if (!andPhrase) {
        return emptyClause
    }

    return nounPhraseToClause(andPhrase['noun-phrase'] /* TODO! args */) // maybe problem if multiple things have same id, query is not gonna find them
}

function genitiveToClause(ast?: NounPhrase, args?: ToClauseOpts): Clause {

    if (!ast) {
        return emptyClause
    }

    const ownedId = args?.subject!
    const ownerId = getIncrementalId()
    const owner = nounPhraseToClause(ast.owner, { subject: ownerId, autovivification: false, sideEffects: false })
    return clauseOf({ root: 'of', type: 'genitive-particle', referents: [] } /* genitiveParticle */, ownedId, ownerId).and(owner)
}

function isAstPlural(ast: AstNode): boolean {

    if (!ast) {
        return false
    }

    if (ast.type === 'noun-phrase') {
        return !!ast.uniquant || Object.values(ast).some(x => isAstPlural(x))
    }

    if (ast.type === 'pronoun' || ast.type === 'noun') {
        return isPlural(ast)
    }

    return false
}

function getInterestingIds(maps: Map[], clause: Clause): Id[] {

    // const getNumberOfDots = (id: Id) => id.split('.').length //-1
    // the ones with most dots, because 'color of style of button' 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if 'color of button AND button'
    // const ids = maps.flatMap(x => Object.values(x))
    // const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    // return ids.filter(x => getNumberOfDots(x) === maxLen)

    const oc = getOwnershipChain(clause)

    if (oc.length <= 1) {
        return maps.flatMap(x => Object.values(x)) //all
    }

    // TODO: problem not returning everything because of getOwnershipChain()
    return maps.flatMap(m => m[oc.at(-1)!]) // owned leaf

}


function createThing(clause: Clause): Thing {
    const bases = clause.flatList().map(x => x.predicate?.referents?.[0]!)/* ONLY FIRST? */.filter(x => x)
    const id = getIncrementalId()
    return getThing({ id, bases })
}

function evalString(context: Context, ast?: StringLiteral, args?: ToClauseOpts): Thing[] {

    if (!ast) {
        return []
    }

    const x = ast['string-token'].list.map(x => x.token)
    const y = x.join(' ')
    return [new StringThing(y)]
}

function couldHaveSideEffects(ast: AstNode) { // anything that is not a nounphrase COULD have side effects

    if (ast.type === 'macro') { // this is not ok, it's here just for performance reasons (saving all of the macros is currently expensive) 
        return false
    }

    return ast.type === 'simple-sentence' || ast.type === 'complex-sentence'
}

interface ToClauseOpts {
    subject?: Id,
    autovivification?: boolean,
    sideEffects?: boolean,
}

export function evalMacro(context: Context, macro: Macro): Thing[] {

    const macroparts = macro.macropart.list ?? []
    const syntax = macroparts.map(m => macroPartToMember(m))
    const name = macro.subject.root

    if (!name) {
        throw new Error('Anonymous syntax!')
    }

    context.setSyntax(name, syntax)
    return []
}

function macroPartToMember(macroPart: Macropart): Member {

    const taggedUnions = macroPart?.taggedunion?.list ?? []
    const grammars = taggedUnions.map(x => x?.noun)

    const exceptUnions = macroPart?.exceptunion?.taggedunion?.list ?? []
    const notGrammars = exceptUnions.map(x => x?.noun)

    return {
        types: grammars.flatMap(g => (g?.root as AstType) ?? []),
        role: macroPart["grammar-role"]?.root,
        number: macroPart.cardinality?.cardinality,
        exceptTypes: notGrammars.flatMap(g => (g?.root as AstType) ?? []),
        notAst: !!macroPart['not-ast-keyword'],
        expand: !!macroPart['expand-keyword'],
    }

}
