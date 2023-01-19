import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause } from "../../clauses/Clause";
import SubordinateClause from "../interfaces/SubordinateClause";
import NounPhrase from "./NounPhrase";
import { Lexeme } from "../../lexer/Lexeme";

export default class CopulaSubordinateClause implements SubordinateClause {

    constructor(readonly relpron: Lexeme<'relpron'>, readonly predicate: NounPhrase, readonly copula: Lexeme<'copula'>) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> {
        return (await this.predicate.toClause({ ...args, roles: { subject: args?.roles?.subject } }))
        .copy({sideEffecty : false})
    }

}