import { extrapolate, Lexeme } from '../frontend/lexer/Lexeme';
import { Clause, clauseOf, emptyClause } from '../middle/clauses/Clause';
import { Id } from '../middle/id/Id';
import { Map } from '../middle/id/Map';
import { uniq } from '../utils/uniq';
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

    clone(opts?: { id: Id }): Thing {
        return new BaseThing(
            opts?.id ?? this.id, // clones have same id
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
        const child = this.children[p1] ?? this.children[id]
        const res = /* parts.length > 1 */ child.getId() !== id ? child.get(id /* parts.slice(1).join('.') */) : child
        return res ?? this.bases.find(x => x.get(id))
    }

    set(id: Id, thing: Thing): void {
        this.children[id] = thing
        this.setLexeme({ root: 'thing', type: 'noun', referents: [thing] }) // every thing is a thing

        //TODO
        if (typeof thing.toJs() === 'string') { //TODO make this polymorphic
            this.setLexeme({ root: 'string', type: 'noun', referents: [thing] }) 
        } else if (typeof thing.toJs() === 'number') {
            this.setLexeme({ root: 'number', type: 'noun', referents: [thing] })
        }

    }

    toJs(): object | number {
        return this //TODOooooooooOO!
    }

    query(query: Clause): Map[] {
        return uniq(this.toClause(query).query(query, {/* it: this.lastReferenced  */ }))
    }

    toClause = (query?: Clause): Clause => {

        const x = this.lexemes
            .flatMap(x => x.referents.map(r => clauseOf(x, r.getId())))
            .reduce((a, b) => a.and(b), emptyClause)

        const y = Object
            .keys(this.children)
            .map(x => clauseOf({ root: 'of', type: 'preposition', referents: [] }, x, this.id)) // hardcoded english!
            .reduce((a, b) => a.and(b), emptyClause)

        const z = Object
            .values(this.children)
            .map(x => x.toClause(query))
            .reduce((a, b) => a.and(b), emptyClause)

        return x.and(y).and(z).simple
    }

    setLexeme = (lexeme: Lexeme) => {

        const old = this.lexemes.filter(x => x.root === lexeme.root)
        const updated: Lexeme[] = old.map(x => ({ ...x, ...lexeme, referents: [...x.referents, ...lexeme.referents] }))
        this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root)
        const toBeAdded = updated.length ? updated : [lexeme]
        this.lexemes.push(...toBeAdded)
        const extrapolated = toBeAdded.flatMap(x => extrapolate(x, this))
        this.lexemes.push(...extrapolated)

    }

    getLexemes = (rootOrToken: string): Lexeme[] => {
        return this.lexemes
            .filter(x => rootOrToken === x.token || rootOrToken === x.root)
    }

    removeLexeme(rootOrToken: string): void {
        const garbage = this.getLexemes(rootOrToken).flatMap(x => x.referents)
        garbage.forEach(x => delete this.children[x.getId()])
        this.lexemes = this.lexemes.filter(x => rootOrToken !== x.token && rootOrToken !== x.root)
    }

    equals(other: Thing): boolean { //TODO: implement nested structural equality
        return this.toJs() === other?.toJs()
    }
}
