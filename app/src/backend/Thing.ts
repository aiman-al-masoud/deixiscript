import { Clause } from "../middle/clauses/Clause"
import { Id } from "../middle/id/Id"
import { Map } from "../middle/id/Map"
import { BaseThing } from "./BaseThing"
import { Context } from "./Context"


export interface Thing {
    get(id: Id): Thing | undefined
    set(id: Id, thing: Thing): void //thing.id???
    clone(): Thing
    toJs(): object
    toClause(query?: Clause): Clause
    getId(): Id
    extends(thing: Thing): void
    unextends(thing: Thing): void
    query(clause: Clause): Map[]
}

export interface Verb extends Thing {
    run(context: Context, args: { [role in VerbArgs]: Thing }): Thing[] // called directly in evalVerbSentence()
}

export function getThing(args: { id: Id, bases: Thing[] }) {
    return new BaseThing(args.id, args.bases)
}

type VerbArgs = 'subject'
    | 'directObject'
    | 'indirectObject'
    // ...
