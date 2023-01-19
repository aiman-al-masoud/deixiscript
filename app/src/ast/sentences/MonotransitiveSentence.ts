import Brain from "../../brain/Brain";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import VerbSentence from "../interfaces/VerbSentence";
import Complement from "../phrases/Complement";
import NounPhrase from "../phrases/NounPhrase";
import { Lexeme } from "../../lexer/Lexeme";

export default class MonotransitiveSentence implements VerbSentence {

    constructor(readonly subject: NounPhrase,
                readonly mverb: Lexeme<'mverb'>,
                readonly object: NounPhrase,
                readonly complements: Complement[],
                readonly negation?: Lexeme<'negation'>) {

    }
    
    async toClause(args?: ToClauseOpts): Promise<Clause> {
        throw new Error("Method not implemented.");
    }
}