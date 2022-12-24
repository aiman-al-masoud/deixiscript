import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause, getRandomId } from "../../clauses/Clause";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    toClause(args?: ToPrologArgs): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        const subject = this.subject.toClause(newArgs)
        const predicate = this.predicate.toClause(newArgs).copy({ negate: !!this.negation })

        return this.subject.isUniQuant() ?
            subject.implies(predicate) :
            subject.concat(predicate, { asRheme: true })

    }

    get isSideEffecty(): boolean {
        return true
    }

}