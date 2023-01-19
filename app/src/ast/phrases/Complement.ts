import { ToClauseOpts } from "../interfaces/Constituent";
import { Clause, clauseOf } from "../../clauses/Clause";
import { getRandomId, Id } from "../../clauses/Id";
import Phrase from "../interfaces/Phrase";
import NounPhrase from "./NounPhrase";
import { Lexeme } from "../../lexer/Lexeme";

export default class Complement implements Phrase {

    constructor(readonly preposition: Lexeme<'preposition'>, readonly nounPhrase: NounPhrase) {

    }

    async toClause(args?: ToClauseOpts): Promise<Clause> { // preposition(args.subject, Y) + nounphrase.toProlog(subject=Y)

        const subjId = args?.roles?.subject ?? ((): Id => { throw new Error('undefined subject id') })()
        const newId = getRandomId()

        return clauseOf(this.preposition.root, subjId, newId)
            .and(await this.nounPhrase.toClause({ ...args, roles: { subject: newId } }))
            .copy({sideEffecty : false})

    }

}