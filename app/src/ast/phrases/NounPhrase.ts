import Phrase from "../interfaces/Phrase";
import Adjective from "../tokens/Adjective";
import Article from "../tokens/Article";
import Noun from "../tokens/Noun";
import Quantifier from "../tokens/Quantifier";
import Complement from "./Complement";
import SubordinateClause from "../interfaces/SubordinateClause";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, clauseOf, emptyClause } from "../../clauses/Clause";
import { getRandomId, Id, isVar, toVar, toConst } from "../../clauses/Id";

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

        const maybeId = args?.roles?.subject ?? getRandomId()
        const subjectId = this.isUniQuant() ? toVar(maybeId) : maybeId
        const newArgs = { ...args, roles: { subject: subjectId } }

        const res = this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => clauseOf(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), emptyClause())
            .and((await Promise.all(this.complements.map(c => c.toClause(newArgs)))).reduce((c1, c2) => c1.and(c2), emptyClause()))
            .and(await this.subordClause?.toClause(newArgs) ?? emptyClause())
            .copy({ sideEffecty: false })

        const x = res.entities // assume ids are case insensitive, assume if IDX is var all idx are var
            .filter(x => isVar(x))
            .map(e => ({ [toConst(e)]: e }))
            .reduce((a, b) => ({ ...a, ...b }), {})

        return res.copy({ map: x })
    }

}