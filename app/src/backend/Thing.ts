import { Lexeme } from "../frontend/lexer/Lexeme"
import { Clause } from "../middle/clauses/Clause"
import { Id } from "../middle/id/Id"
import { Map } from "../middle/id/Map"
import { BaseThing } from "./BaseThing"


export interface Thing {
    get(id: Id): Thing | undefined
    set(id: Id, thing: Thing): void //thing.id???
    clone(opts?: { id: Id }): Thing
    toJs(): object | number
    toClause(query?: Clause): Clause
    extends(thing: Thing): void
    unextends(thing: Thing): void
    query(clause: Clause): Map[]
    getLexemes(rootOrToken: string): Lexeme[]
    removeLexeme(rootOrToken: string): void
    setLexeme(lexeme: Lexeme): void
    getId(): Id
    equals(other: Thing): boolean
}


export function getThing(args: { id: Id, bases: Thing[] }) {
    return new BaseThing(args.id, args.bases)
}