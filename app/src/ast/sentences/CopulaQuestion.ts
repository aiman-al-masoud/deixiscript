import Brain from "../../brain/Brain";
import BinaryQuestion from "../interfaces/BinaryQuestion";
import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import NounPhrase from "../phrases/NounPhrase";
import Copula from "../tokens/Copula";
import CopulaSentence from "./CopulaSentence";

export default class CopulaQuestion implements BinaryQuestion {

    constructor(readonly subject: NounPhrase, readonly predicate: NounPhrase, readonly copula: Copula) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {

        const subjectId = args?.roles?.subject ?? getRandomId({ asVar: this.subject.isUniQuant() })
        const newArgs = { ...args, roles: { subject: subjectId } }

        //TODO: in case of a universally quantified question eg: "are all cats smart?" the prolog
        // produced should NOT be an implication, but rather a check that all cats are smart.

        const clause = await new CopulaSentence(this.subject, this.copula, this.predicate).toClause(newArgs)

        return clause.copy({sideEffecty : false})

    }

}