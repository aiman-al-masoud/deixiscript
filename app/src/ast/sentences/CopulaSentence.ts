import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    toClause(args?: ToClauseOpts): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        const subject = this.subject.toClause(newArgs)
        const predicate = this.predicate.toClause(newArgs).copy({ negate: !!this.negation })

        return this.subject.isUniQuant() ?
            subject.implies(predicate) :
            subject.and(predicate, { asRheme: true })

    }

    get isSideEffecty(): boolean {
        return true
    }

}