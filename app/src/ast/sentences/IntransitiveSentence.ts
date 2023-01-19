import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, clauseOf } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import VerbSentence from "../interfaces/VerbSentence";
import Complement from "../phrases/Complement";
import NounPhrase from "../phrases/NounPhrase";
import { Lexeme } from "../../lexer/Lexeme";

export default class IntransitiveSentence implements VerbSentence {

    constructor(readonly subject: NounPhrase,
        readonly iverb: Lexeme<'iverb'>,
        readonly complements: Complement[],
        readonly negation?: Lexeme<'negation'>) {

    }
    
    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        const theme = await this.subject.toClause(newArgs)
        
        const rheme = clauseOf(this.iverb, subjectId).and((await Promise.all(this.complements.map( c => c.toClause(newArgs)))).reduce( (c1, c2) => c1.and(c2)))
        
        return theme.and(rheme, { asRheme: true }).copy({sideEffecty:true})
    }

}

