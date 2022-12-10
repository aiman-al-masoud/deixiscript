import Ast from "../ast/interfaces/Ast";
import BinaryQuestion from "../ast/interfaces/BinaryQuestion";
import CompoundSentence from "../ast/interfaces/CompoundSentence";
import Declaration from "../ast/interfaces/Declaration";
import Question from "../ast/interfaces/Question";
import SimpleSentence from "../ast/interfaces/SimpleSentence";
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

    private errorOut(errorMsg:string){
        throw new Error(errorMsg)
        return new FullStop('.')
    }

    parse(): Ast {
        return this.try(this.parseDeclaration)
            ?? this.try(this.parseQuestion)
            ?? this.errorOut('FAILED')
    }

    protected parseDeclaration(): Declaration {
        const memento = this.lx.pos
        try { return this.parseSimple() } catch { }
    }

    protected parseQuestion(): Question {

    }

    protected parseSimple(): SimpleSentence {

    }

    protected parseCompound(): CompoundSentence {

    }

    protected parseVerbSentence(): VerbSentence {

    }

    protected parseCopulaSentence(): CopulaSentence {

    }

    protected parseComplex(): ComplexSentence {

    }

    protected parseConjunctive(): ConjunctiveSentence {

    }

    protected parseCopulaSentence(): CopulaSentence {

    }

    protected parseVerbSentence(): VerbSentence {

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


}