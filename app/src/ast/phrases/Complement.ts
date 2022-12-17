import { ToPrologArgs, getRandomId } from "../interfaces/Constituent";
import { Clause, clauseOf } from "../interfaces/Clause";
import Phrase from "../interfaces/Phrase";
import Preposition from "../tokens/Preposition";
import NounPhrase from "./NounPhrase";

export default class Complement implements Phrase {

    constructor(readonly preposition: Preposition, readonly nounPhrase: NounPhrase) {

    }

    toProlog(args?: ToPrologArgs): Clause { // preposition(args.subject, Y) + nounphrase.toProlog(subject=Y)

        const newId = getRandomId()

        return clauseOf(`${this.preposition.string}(${args?.roles?.subject}, ${newId})`)
            .concat(this.nounPhrase.toProlog({ ...args, roles: { subject: newId } }))

    }

}