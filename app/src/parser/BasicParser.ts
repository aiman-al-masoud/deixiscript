import Ast from "../ast/interfaces/Ast";
import BinaryQuestion from "../ast/interfaces/BinaryQuestion";
import CompoundSentence from "../ast/interfaces/CompoundSentence";
import Declaration from "../ast/interfaces/Declaration";
import Question from "../ast/interfaces/Question";
import SimpleSentence from "../ast/interfaces/SimpleSentence";
import Token from "../ast/interfaces/Token";
import VerbSentence from "../ast/interfaces/VerbSentence";
import Complement from "../ast/phrases/Complement";
import NounPhrase from "../ast/phrases/NounPhrase";
import SubordinateClause from "../ast/phrases/SubordinateClause";
import ComplexSentence from "../ast/sentences/ComplexSentence";
import ConjunctiveSentence from "../ast/sentences/ConjunctiveSentence";
import CopulaQuestion from "../ast/sentences/CopulaQuestion";
import CopulaSentence from "../ast/sentences/CopulaSentence";
import IntransitiveSentence from "../ast/sentences/IntransitiveSentence";
import MonotransitiveSentence from "../ast/sentences/MonotransitiveSentence";
import Copula from "../ast/tokens/Copula";
import FullStop from "../ast/tokens/FullStop";
import Negation from "../ast/tokens/Negation";
import Lexer, { getLexer } from "../lexer/Lexer";
import Parser from "./Parser";

export default class BasicParser implements Parser {

    private lx: Lexer

    constructor(sourceCode: string) {
        this.lx = getLexer(sourceCode)
    }

    private try<T extends Ast>(method: () => T) {
        const memento = this.lx.pos
        try { return method() } catch { this.lx.backTo(memento) }
    }

    private errorOut(errorMsg: string): Ast {
        console.debug(errorMsg)
        throw new Error(errorMsg)
    }

    parse(): Ast {
        return this.try(this.parseDeclaration)
            ?? this.try(this.parseQuestion)
            ?? this.errorOut('FAILED: parse()')
    }

    protected parseDeclaration(): Declaration {
        return this.try(this.parseSimple)
            ?? this.try(this.parseCompound)
            ?? this.errorOut('FAILED: parseDeclaration()')
    }

    protected parseQuestion(): Question {
        return this.try(this.parseBinaryQuestion)
            ?? this.errorOut('FAILED: parseQuestion()')
    }

    protected parseSimple(): SimpleSentence {
        return this.try(this.parseCopulaSentence)
            ?? this.try(this.parseVerbSentence)
            ?? this.errorOut('FAILED: parseSimple()')
    }

    protected parseCompound(): CompoundSentence {
        return this.try(this.parseComplex)
            ?? this.try(this.parseConjunctive)
            ?? this.errorOut('FAILED: parseCompound()')
    }

    protected parseVerbSentence(): VerbSentence {
        return this.try(this.parseIntransitiveSentence)
            ?? this.try(this.parseMonotransitiveSentence)
            ?? this.errorOut('FAILED: parseVerbSentence()')
    }

    protected parseCopulaSentence(): CopulaSentence {

        const subject = this.parseNounPhrase()
        const copula = this.assert<Copula>(this.lx.peek, 'FAILED: parseCopulaSentence(), expected copula')
        const negation = this.softAssert<Negation>(this.lx.peek)
        const predicate = this.parseNounPhrase()

        return new CopulaSentence(subject, copula, predicate, negation)

    }

    protected parseComplex(): ComplexSentence {

    }

    protected parseConjunctive(): ConjunctiveSentence {

    }

    protected parseIntransitiveSentence(): IntransitiveSentence {

    }

    protected parseMonotransitiveSentence(): MonotransitiveSentence {

    }

    protected parseBinaryQuestion(): BinaryQuestion {
        
    }

    protected parseCopulaQuestion(): CopulaQuestion {

    }

    protected parseNounPhrase(): NounPhrase {

    }

    protected parseComplement(): Complement {

    }

    protected parseSubordinateClause(): SubordinateClause {

    }

    protected check<T extends Token>(t: T): t is T {
        return t !== undefined
    }

    protected assert<T extends Token>(t: Token, errorMsg: string): T {
        if (this.check(t)) {
            this.lx.next()
            return (t as T)
        } else {
            throw new Error(errorMsg)
        }
    }

    protected softAssert<T extends Token>(t: Token): T | undefined {
        if (this.check(t)) {
            this.lx.next()
            return (t as T)
        } else {
            return undefined
        }
    }



}