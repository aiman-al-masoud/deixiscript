import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import { getRandomId, isVar, toVar } from "../../clauses/Id";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        const subject = await this.subject.toClause(newArgs)
        const predicate = (await this.predicate.toClause(newArgs)).copy({ negate: !!this.negation })

        const entities = subject.entities.concat(predicate.entities)

        const result = entities.some(e => isVar(e)) ? // assume any sentence with any var is an implication
            subject.implies(predicate) :
            subject.and(predicate, { asRheme: true })

        const x = entities // assume anything owned by a variable is also a variable
            .filter(e => isVar(e))
            .flatMap(e => subject.and(predicate).ownedBy(e))
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        return result.copy({ sideEffecty: true, map: x })
    }

}