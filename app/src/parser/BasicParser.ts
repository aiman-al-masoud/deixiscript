import Ast from "../ast/interfaces/Ast";
import BinaryQuestion from "../ast/interfaces/BinaryQuestion";
import CompoundSentence from "../ast/interfaces/CompoundSentence";
import Declaration from "../ast/interfaces/Declaration";
import Question from "../ast/interfaces/Question";
import SimpleSentence from "../ast/interfaces/SimpleSentence";
import VerbSentence from "../ast/interfaces/VerbSentence";
import Complement from "../ast/phrases/Complement";
import NounPhrase from "../ast/phrases/NounPhrase";
import SubordinateClause from "../ast/interfaces/SubordinateClause";
import ComplexSentence from "../ast/sentences/ComplexSentence";
import ConjunctiveSentence from "../ast/sentences/ConjunctiveSentence";
import CopulaQuestion from "../ast/sentences/CopulaQuestion";
import CopulaSentence from "../ast/sentences/CopulaSentence";
import IntransitiveSentence from "../ast/sentences/IntransitiveSentence";
import MonotransitiveSentence from "../ast/sentences/MonotransitiveSentence";
import Lexer, { getLexer } from "../lexer/Lexer";
import Parser from "./Parser";
import CopulaSubordinateClause from "../ast/phrases/CopulaSubordinateClause";
import Constituent from "../ast/interfaces/Constituent";
import { Lexeme } from "../lexer/Lexeme";

export default class BasicParser implements Parser {

    protected lx: Lexer

    constructor(sourceCode: string) {
        this.lx = getLexer(sourceCode)
    }

    protected try<T extends Ast>(method: () => T) {

        const memento = this.lx.pos

        try {
            return method()
        } catch (error) {
            this.lx.backTo(memento)
        }

    }

    protected errorOut(errorMsg: string): Constituent {
        this.lx.croak(errorMsg)
        throw new Error(errorMsg)
    }

    parseAll(): Constituent[] {

        const results: Constituent[] = []

        while (!this.lx.isEnd) {
            results.push(this.parse())
            this.lx.assert('fullstop', { errorOut: false })
        }

        return results
    }

    parse(): Constituent {
        return this.try(this.parseQuestion)
            ?? this.try(this.parseDeclaration)
            ?? this.try(this.parseNounPhrase) // for quick topic reference
            ?? this.errorOut('parse()')
    }

    protected parseDeclaration = (): Declaration => {
        return this.try(this.parseCompound)
            ?? this.try(this.parseSimple)
            ?? this.errorOut('parseDeclaration()')
    }

    protected parseQuestion = (): Question => {
        return this.try(this.parseBinaryQuestion)
            ?? this.errorOut('parseQuestion()')
    }

    protected parseSimple = (): SimpleSentence => {
        return this.try(this.parseCopulaSentence)
            ?? this.try(this.parseVerbSentence)
            ?? this.errorOut('parseSimple()')
    }

    protected parseCompound = (): CompoundSentence => {
        return this.try(this.parseComplex)
            ?? this.try(this.parseConjunctive)
            ?? this.errorOut('parseCompound()')
    }

    protected parseVerbSentence = (): VerbSentence => {
        return this.try(this.parseIntransitiveSentence)
            ?? this.try(this.parseMonotransitiveSentence)
            ?? this.errorOut('parseVerbSentence()')
    }

    protected parseCopulaSentence = (): CopulaSentence => {
        const subject = this.parseNounPhrase()
        const copula = this.lx.assert('copula', { errorMsg: 'parseCopulaSentence(), expected copula' })
        const negation = this.lx.assert('negation', { errorOut: false })
        const predicate = this.parseNounPhrase()
        return new CopulaSentence(subject, copula as Lexeme<'copula'>, predicate, negation)
    }

    protected parseComplex = (): ComplexSentence => {

        const subconj = this.lx.assert('subconj', { errorOut: false })

        if (subconj) {
            const condition = this.parseSimple()
            this.lx.assert('then', { errorOut: false })
            const outcome = this.parseSimple()
            return new ComplexSentence(condition, outcome, subconj as Lexeme<'subconj'>)
        } else {
            const outcome = this.parseSimple()
            const subconj = this.lx.assert('subconj', { errorOut: true, errorMsg: 'expected subordinating conjunction' })
            const condition = this.parseSimple()
            return new ComplexSentence(condition, outcome, subconj as Lexeme<'subconj'>)
        }

    }

    protected parseIntransitiveSentence = (): IntransitiveSentence => {
        const subject = this.parseNounPhrase()
        const negation = this.lx.assert('negation', { errorOut: false })
        const iverb = this.lx.assert('iverb', { errorMsg: 'parseIntransitiveSentence(), expected i-verb' })
        const complements = this.parseComplements()
        return new IntransitiveSentence(subject, iverb as Lexeme<'iverb'>, complements, negation as Lexeme<'negation'>)
    }

    protected parseMonotransitiveSentence = (): MonotransitiveSentence => {
        const subject = this.parseNounPhrase()
        const negation = this.lx.assert('negation', { errorOut: false })
        const mverb = this.lx.assert('mverb', { errorMsg: 'parseMonotransitiveSentence(), expected i-verb' })
        const cs1 = this.parseComplements()
        const object = this.parseNounPhrase()
        const cs2 = this.parseComplements()
        return new MonotransitiveSentence(subject, mverb as Lexeme<'mverb'>, object, cs1.concat(cs2), negation as Lexeme<'negation'>)
    }

    protected parseBinaryQuestion = (): BinaryQuestion => {
        return this.try(this.parseCopulaQuestion)
            ?? this.errorOut('parseBinaryQuestion()')
    }

    protected parseCopulaQuestion = (): CopulaQuestion => {
        const copula = this.lx.assert('copula', { errorMsg: 'parseCopulaQuestion(), expected copula' })
        const subject = this.parseNounPhrase()
        const predicate = this.parseNounPhrase()
        return new CopulaQuestion(subject, predicate, copula as Lexeme<'copula'>)
    }

    protected parseNounPhrase = (): NounPhrase => {
        const quantifier = this.lx.assert('uniquant', { errorOut: false });

        let article: Lexeme<'indefart'> | Lexeme<'defart'> | undefined

        if (['defart', 'indefart'].includes(this.lx.peek.type)) {
            article = this.lx.peek as (Lexeme<'indefart'> | Lexeme<'defart'>)
            this.lx.next()
        }

        let adjectives = []
        let adj

        while (adj = this.lx.assert('adj', { errorOut: false })) {
            adjectives.push(adj)
        }

        const noun = this.lx.assert('noun', { errorOut: false })
        const subordinateClause = this.try(this.parseSubordinateClause)
        const complements = this.parseComplements()

        return new NounPhrase(adjectives, complements, noun, quantifier, article, subordinateClause)
    }

    protected parseComplements = (): Complement[] => {

        const complements = []
        let comp

        while (comp = this.try(this.parseComplement)) {
            complements.push(comp)
        }

        return complements
    }

    protected parseComplement = (): Complement => {
        const preposition = this.lx.assert('preposition', { errorMsg: 'parseComplement() expected preposition' })
        const nounPhrase = this.parseNounPhrase()
        return new Complement(preposition as Lexeme<'preposition'>, nounPhrase)
    }

    protected parseSubordinateClause = (): SubordinateClause => {
        return this.try(this.parseCopulaSubordinateClause)
            ?? this.errorOut('parseSubordinateClause()')
    }

    protected parseCopulaSubordinateClause = (): CopulaSubordinateClause => {
        const relpron = this.lx.assert('relpron', { errorMsg: 'parseCopulaSubordinateClause() expected relative pronoun' })
        const copula = this.lx.assert('copula', { errorMsg: 'parseCopulaSubordinateClause() expected copula' })
        const subject = this.parseNounPhrase()
        return new CopulaSubordinateClause(relpron as Lexeme<'relpron'>, subject, copula as Lexeme<'copula'>)
    }

    protected parseConjunctive = (): ConjunctiveSentence => {
        throw new Error('NOT IMPLEMENTED! TODO!')
    }

}