import Phrase from "../interfaces/Phrase";
import Adjective from "../tokens/Adjective";
import Article from "../tokens/Article";
import Noun from "../tokens/Noun";
import Quantifier from "../tokens/Quantifier";
import Complement from "./Complement";
import SubordinateClause from "../interfaces/SubordinateClause";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, clauseOf, emptyClause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";

export default class NounPhrase implements Phrase {

    constructor(readonly adjectives: Adjective[],
        readonly complements: Complement[],
        readonly noun?: Noun,
        readonly quantifier?: Quantifier,
        readonly article?: Article,
        readonly subordClause?: SubordinateClause) {

    }

    isUniQuant() {
        return this.quantifier?.isUniversal() ?? false
    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } }


        return this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => clauseOf(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), emptyClause())
            .and((await Promise.all(this.complements.map(c => c.toClause(newArgs)))).reduce((c1, c2) => c1.and(c2), emptyClause()))
            .and(await this.subordClause?.toClause(newArgs) ?? emptyClause())
            .copy({sideEffecty : false})

    }

}