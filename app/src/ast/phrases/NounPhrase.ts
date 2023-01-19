import Phrase from "../interfaces/Phrase";
import Complement from "./Complement";
import SubordinateClause from "../interfaces/SubordinateClause";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, clauseOf, emptyClause } from "../../clauses/Clause";
import { getRandomId, toVar } from "../../clauses/Id";
import { Lexeme } from "../../lexer/Lexeme";

export default class NounPhrase implements Phrase {

    constructor(readonly adjectives: Lexeme<'adj'>[],
        readonly complements: Complement[],
        readonly noun?: Lexeme<'noun'>,
        readonly quantifier?: Lexeme<'uniquant'> | Lexeme<'existquant'>,
        readonly article?: Lexeme<'defart'> | Lexeme<'indefart'>,
        readonly subordClause?: SubordinateClause) {

    }

    isUniQuant() {
        return this.quantifier?.type === 'uniquant' ?? false
    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const maybeId = args?.roles?.subject ?? getRandomId()
        const subjectId = this.isUniQuant() ? toVar(maybeId) : maybeId
        const newArgs = { ...args, roles: { subject: subjectId } }

        const res = this
            .adjectives
            .map(a => a.root)
            .concat(this.noun ? [this.noun.root] : [])
            .map(p => clauseOf(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), emptyClause())
            .and((await Promise.all(this.complements.map(c => c.toClause(newArgs)))).reduce((c1, c2) => c1.and(c2), emptyClause()))
            .and(await this.subordClause?.toClause(newArgs) ?? emptyClause())
            .copy({ sideEffecty: false })

        return res
    }

}