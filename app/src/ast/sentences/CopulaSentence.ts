import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, emptyClause } from "../../clauses/Clause";
import { getRandomId, isVar, toVar } from "../../clauses/Id";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";
import { getAnaphora } from "../../Anaphora";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {
        // TODO: resolve them in noun phrases, maybe recycle code from Enviro but avoid too much coupling

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })

        const newArgs = { ...args, roles: { subject: subjectId } }
        const subject = await this.subject.toClause(newArgs)
        const newArgs2 = { ...newArgs, anaphora: (newArgs.anaphora ?? emptyClause()).and(subject) }
        const predicate = (await this.predicate.toClause(newArgs2)).copy({ negate: !!this.negation })

        const entities = subject.entities.concat(predicate.entities)

        const result = entities.some(e => isVar(e)) ? // assume any sentence with any var is an implication
            subject.implies(predicate) :
            subject.and(predicate, { asRheme: true })

        // get anaphora
        const a = getAnaphora()
        await a.assert(subject)
        const m1 = (await a.query(predicate) )[0]
        // console.log({ m1 })

        // return result.copy({ sideEffecty: true, map: x })
        const result2 = result.copy({ sideEffecty: true, map: m1 })
        
        const m2 = result2.entities // assume anything owned by a variable is also a variable
            .filter(e => isVar(e))
            .flatMap(e => result2.ownedBy(e))
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        
        // console.log({m2})

        return result2.copy({ map: m2 })
    }

}