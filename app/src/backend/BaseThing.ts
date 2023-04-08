import { extrapolate, Lexeme } from '../frontend/lexer/Lexeme';
import { Clause, clauseOf, emptyClause } from '../middle/clauses/Clause';
import { Id } from '../middle/id/Id';
import { Map } from '../middle/id/Map';
import { Thing } from './Thing';


export class BaseThing implements Thing {

    constructor(
        protected readonly id: Id,
        protected bases: Thing[] = [],
        protected readonly children: { [id: Id]: Thing } = {},
        protected lexemes: Lexeme[] = [],
    ) {

    }

    getId(): Id {
        return this.id
    }

    clone(): Thing {
        return new BaseThing(
            this.id, // clones have same id
            this.bases.map(x => x.clone()),
            Object.entries(this.children).map(e => ({ [e[0]]: e[1].clone() })).reduce((a, b) => ({ ...a, ...b })),
        )
    }

    extends = (thing: Thing) => {
        this.unextends(thing) // or avoid?
        this.bases.push(thing.clone())
    }

    unextends(thing: Thing): void {
        this.bases = this.bases.filter(x => x.getId() !== thing.getId())
    }

    get = (id: Id): Thing | undefined => {
        const parts = id.split('.')
        const p1 = parts[0]
        const child = this.children[p1]
        const res = parts.length > 1 ? child.get(parts.slice(1).join('.')) : child
        return res ?? this.bases.find(x => x.get(id))
    }

    set(id: Id, thing: Thing): void {
        this.children[id] = thing
    }

    toJs(): object {
        throw new Error('TODO!');
    }

    query(query: Clause): Map[] {
        // const universe = Object.values(this.children)
        //     .map(w => w.toClause(clause))
        //     .reduce((a, b) => a.and(b), emptyClause)
        // return universe.query(clause, {/*  it: this.lastReferenced  */ })
        return this.toClause(query).query(query, {/* it: this.lastReferenced  */ })
    }

    toClause = (query?: Clause): Clause => {

        const x = this.lexemes
            .filter(x => x.referent)
            .map(x => clauseOf(x, x.referent?.getId()!))
            .reduce((a, b) => a.and(b), emptyClause)

        const y = Object
            .keys(this.children)
            .map(x => clauseOf({ root: 'of', type: 'preposition' }, x, this.id)) // hardcoded english!
            .reduce((a, b) => a.and(b), emptyClause)

        const z = Object
            .values(this.children)
            .map(x => x.toClause(query))
            .reduce((a, b) => a.and(b), emptyClause)

        return x.and(y).and(z)
    }

    setLexeme = (lexeme: Lexeme) => {

        // if (lexeme.root && !lexeme.token && this.lexemes.some(x => x.root === lexeme.root)) {
        //     this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root)
        // }

        this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root)
        this.lexemes.push(lexeme)
        this.lexemes.push(...extrapolate(lexeme, this))
    }

    getLexeme = (rootOrToken: string): Lexeme | undefined => {
        return this.lexemes
            .filter(x => rootOrToken === x.token || rootOrToken === x.root)
            .at(0)
    }
}
