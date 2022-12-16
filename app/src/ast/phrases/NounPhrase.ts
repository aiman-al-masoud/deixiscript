import Brain from "../../brain/Brain";
import Phrase from "../interfaces/Phrase";
import Adjective from "../tokens/Adjective";
import Article from "../tokens/Article";
import Noun from "../tokens/Noun";
import Quantifier from "../tokens/Quantifier";
import Complement from "./Complement";
import SubordinateClause from "../interfaces/SubordinateClause";
import { ToPrologArgs, Clause, getRandomId } from "../interfaces/Constituent";

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

    toProlog(args?: ToPrologArgs): Clause[] {

        const subjectId = args?.roles?.subject ?? getRandomId()

        return this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => `${p}(${subjectId})`)
            .map(s => ({ string: s }))
            .concat(this.complements.flatMap(c => c.toProlog({ ...args, roles: { subject: subjectId } })))
            .concat(this.subordClause?.toProlog({ ...args, roles: { subject: subjectId } }) ?? [])

    }

}