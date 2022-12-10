import Universe from "../../universe/Universe";
import Phrase from "../interfaces/Phrase";
import SubordinateClause from "../interfaces/SubordinateClause";
import Copula from "../tokens/Copula";
import Noun from "../tokens/Noun";
import RelativePronoun from "../tokens/RelativePronoun";
import NounPhrase from "./NounPhrase";

export default class CopulaSubordinateClause implements SubordinateClause{

    constructor(readonly relpron:RelativePronoun, readonly predicate:NounPhrase, readonly copula:Copula){

    }

    exec(universe: Universe) {
        throw new Error("Method not implemented.");
    }
    
}