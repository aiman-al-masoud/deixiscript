import { ToPrologArgs } from "../interfaces/Constituent";
import { Clause, clauseOf, getRandomId, Id } from "../../clauses/Clause";
import Phrase from "../interfaces/Phrase";
import Preposition from "../tokens/Preposition";
import NounPhrase from "./NounPhrase";

export default class Complement implements Phrase {

    constructor(readonly preposition: Preposition, readonly nounPhrase: NounPhrase) {

    }

    toProlog(args?: ToPrologArgs): Clause { // preposition(args.subject, Y) + nounphrase.toProlog(subject=Y)

        const subjId = args?.roles?.subject ?? ((): Id => { throw new Error('undefined subject id') })()
        const newId = getRandomId()

        return clauseOf(this.preposition.string, subjId, newId)
            .concat(this.nounPhrase.toProlog({ ...args, roles: { subject: newId } }))

    }

    get isSideEffecty(): boolean {
        return false
    }

}