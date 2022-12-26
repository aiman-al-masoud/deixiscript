import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, clauseOf } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import VerbSentence from "../interfaces/VerbSentence";
import Complement from "../phrases/Complement";
import NounPhrase from "../phrases/NounPhrase";
import IVerb from "../tokens/IVerb";
import Negation from "../tokens/Negation";

export default class IntransitiveSentence implements VerbSentence {

    constructor(readonly subject: NounPhrase,
        readonly iverb: IVerb,
        readonly complements: Complement[],
        readonly negation?: Negation) {

    }

    get isSideEffecty(): boolean {
        return true
    }

    toClause(args?: ToClauseOpts): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        const theme = this.subject.toClause(newArgs)
        const rheme = clauseOf(this.iverb.string, subjectId)
            .and(this.complements.map(c => c.toClause(newArgs)).reduce((c1, c2) => c1.and(c2)))

        return theme.and(rheme, { asRheme: true })
    }

}

