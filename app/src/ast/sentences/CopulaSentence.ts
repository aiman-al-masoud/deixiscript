import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, emptyClause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";
// import { getAnaphora } from "../../brain/Anaphora";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        const subject = await this.subject.toClause(newArgs)
        const predicate = (await this.predicate.toClause(newArgs)).copy({ negate: !!this.negation })

        const result = this.subject.isUniQuant() ?
            subject.implies(predicate) :
            subject.and(predicate, { asRheme: true })

        return result.copy({ sideEffecty: true })

    }

}