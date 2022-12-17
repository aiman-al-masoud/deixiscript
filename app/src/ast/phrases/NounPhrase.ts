import Phrase from "../interfaces/Phrase";
import Adjective from "../tokens/Adjective";
import Article from "../tokens/Article";
import Noun from "../tokens/Noun";
import Quantifier from "../tokens/Quantifier";
import Complement from "./Complement";
import SubordinateClause from "../interfaces/SubordinateClause";
import { ToPrologArgs, getRandomId } from "../interfaces/Constituent";
import { Clause, clauseOf, emptyClause } from "../interfaces/Clause";

export default class NounPhrase implements Phrase {

    constructor(readonly adjectives: Adjective[],
        readonly complements: Complement[],
        readonly noun?: Noun,
        readonly quantifier?: Quantifier,
        readonly article?: Article,
        readonly subordClause?: SubordinateClause) {

    }

    isUniversallyQuantified() {
        return this.quantifier?.isUniversal() ?? false
    }

    toProlog(args?: ToPrologArgs): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId()
        const newArgs = { ...args, roles: { subject: subjectId } }

        return this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => clauseOf(`${p}(${subjectId})`) )
            .reduce((c1,c2)=>c1.concat(c2), emptyClause())
            .concat(this.complements.map(c=>c.toProlog(newArgs)).reduce((c1, c2)=>c1.concat(c2), emptyClause()))
            .concat(this.subordClause?.toProlog(newArgs) ?? emptyClause())

    }

}