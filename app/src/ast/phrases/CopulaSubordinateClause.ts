import Brain from "../../brain/Brain";
import { ToPrologArgs, Clause } from "../interfaces/Constituent";
import Phrase from "../interfaces/Phrase";
import SubordinateClause from "../interfaces/SubordinateClause";
import Copula from "../tokens/Copula";
import Noun from "../tokens/Noun";
import RelativePronoun from "../tokens/RelativePronoun";
import NounPhrase from "./NounPhrase";

export default class CopulaSubordinateClause implements SubordinateClause {

    constructor(readonly relpron: RelativePronoun, readonly predicate: NounPhrase, readonly copula: Copula) {

    }
    
    toProlog(args?: ToPrologArgs): Clause[] {
        return this.predicate.toProlog({ ...args, roles: { subject: args?.roles?.subject } })
    }

}