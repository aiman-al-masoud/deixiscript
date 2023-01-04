import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";
import Copula from "../tokens/Copula";
import RelativePronoun from "../tokens/RelativePronoun";
import NounPhrase from "./NounPhrase";

export default class CopulaSubordinateClause implements SubordinateClause {

    constructor(readonly relpron: RelativePronoun, readonly predicate: NounPhrase, readonly copula: Copula) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {
        return (await this.predicate.toClause({ ...args, roles: { subject: args?.roles?.subject } }))
        .copy({sideEffecty : false})
    }

}