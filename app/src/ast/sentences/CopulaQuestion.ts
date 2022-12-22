import Brain from "../../brain/Brain";
import BinaryQuestion from "../interfaces/BinaryQuestion";
import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause, getRandomId, makeHornClauses } from "../../clauses/Clause";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import CopulaSentence from "./CopulaSentence";

export default class CopulaQuestion implements BinaryQuestion {

    constructor(readonly subject: NounPhrase, readonly predicate: NounPhrase, readonly copula: Copula) {

    }

    toProlog(args?: ToPrologArgs): Clause {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        //TODO: in case of a universally quantified question eg: "are all cats smart?" the prolog
        // produced should NOT be an implication, but rather a check that all cats are smart.

        return new CopulaSentence(this.subject, this.copula, this.predicate).toProlog(newArgs)

    }

}