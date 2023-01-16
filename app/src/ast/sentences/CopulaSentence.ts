import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import { getRandomId, isVar, toConst, toVar } from "../../clauses/Id";
import SimpleSentence from "../interfaces/SimpleSentence";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import Negation from "../tokens/Negation";
import { getAnaphora } from "../../Anaphora";

export default class CopulaSentence implements SimpleSentence {

    constructor(readonly subject: NounPhrase, readonly copula: Copula, readonly predicate: NounPhrase, readonly negation?: Negation) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })

        const newArgs = { ...args, roles: { subject: subjectId } }
        const subject = await this.subject.toClause(newArgs)
        const predicate = (await this.predicate.toClause(newArgs)).copy({ negate: !!this.negation })

        const entities = subject.entities.concat(predicate.entities)

        const result = entities// assume any sentence with any var is an implication
            .some(e => isVar(e)) ?
            subject.implies(predicate) :
            subject.and(predicate, { asRheme: true })

        const m0 = result.entities // assume ids are case insensitive, assume if IDX is var all idx are var
            .filter(x => isVar(x))
            .map(e => ({ [toConst(e)]: e }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        const a = getAnaphora() // get anaphora
        await a.assert(subject)
        const m1 = (await a.query(predicate))[0] ?? {}
        // console.log({m1})

        const result2 = result.copy({ map: m0 }).copy({ sideEffecty: true, map: m1 })

        const m2 = result2.entities // assume anything owned by a variable is also a variable
            .filter(e => isVar(e))
            .flatMap(e => result2.ownedBy(e))
            .map(e => ({ [e]: toVar(e) }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        return result2.copy({ map: m2 })
    }

}