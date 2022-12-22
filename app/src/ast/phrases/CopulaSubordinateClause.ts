import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";
import Copula from "../tokens/Copula";
import RelativePronoun from "../tokens/RelativePronoun";
import NounPhrase from "./NounPhrase";

export default class CopulaSubordinateClause implements SubordinateClause {

    constructor(readonly relpron: RelativePronoun, readonly predicate: NounPhrase, readonly copula: Copula) {

    }

    toProlog(args?: ToPrologArgs): Clause {
        return this.predicate.toProlog({ ...args, roles: { subject: args?.roles?.subject } })
    }

    get isSideEffecty(): boolean {
        return false
    }

}