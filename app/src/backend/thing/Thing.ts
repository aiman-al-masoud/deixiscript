import { Id } from "../../middle/id/Id"
import { Clause } from "../../middle/clauses/Clause"
import { Context } from "../../facade/context/Context"
import { BaseThing } from "./BaseThing"

export default interface Thing {
    get(id: Id): Thing | undefined
    set(id: Id, thing: Thing): void
    clone(): Thing
    toJs(): object
    toClause(query?: Clause): Clause
    getId(): Id
    extends(thing: Thing): void
    unextends(thing: Thing): void
}

export interface Verb extends Thing {
    run(context: Context, args: { [role in VerbArgs]: Thing }): Thing[] // called directly in evalVerbSentence()
}

export function getThing(args: { id: Id, bases: Thing[] }) {
    return new BaseThing(args.id, args.bases)
}

type VerbArgs = 'subject'
    | 'direct-object'
    | 'indirect-object'
    // ...
