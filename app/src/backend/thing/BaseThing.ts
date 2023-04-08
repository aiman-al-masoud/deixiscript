import { Clause } from '../../middle/clauses/Clause';
import { Id } from '../../middle/id/Id';
import { Thing } from './Thing';


export class BaseThing implements Thing {

    constructor(
        protected readonly id: Id,
        protected bases: Thing[] = [],
        protected readonly dictionary: { [id: Id]: Thing } = {},
    ) {

    }

    getId(): Id {
        return this.id
    }

    clone(): Thing {
        return new BaseThing(
            this.id, // clones have same id
            this.bases.map(x => x.clone()),
            Object.entries(this.dictionary).map(e => ({ [e[0]]: e[1].clone() })).reduce((a, b) => ({ ...a, ...b })),
        )
    }

    toClause = (query?: Clause): Clause => {
        // const queryOrEmpty = query ?? emptyClause
        // const res = queryOrEmpty
        //     .flatList()
        //     .filter(x => x.entities.length === 1 && x.predicate)
        //     .filter(x => this.isAlready({ predicate: x.predicate?.referent!, args: [] }))
        //     .map(x => x.copy({ map: { [x.args![0]]: this.id } }))
        //     .reduce((a, b) => a.and(b), emptyClause)
        //     .and(ownerInfo(this, queryOrEmpty))
        // return res
        throw new Error('TODO!');
    }

    extends = (thing: Thing) => {

        // if (this.bases.some(x => x.getId() === thing.getId())) { // or maybe dump old and take new, for example: "the number is 1"
        //     return
        // }
        this.unextends(thing)
        this.bases.push(thing.clone())
    }

    unextends(thing: Thing): void {
        this.bases = this.bases.filter(x => x.getId() !== thing.getId())
    }

    get = (id: Id): Thing | undefined => {
        const parts = id.split('.')
        const p1 = parts[0]
        const child = this.dictionary[p1]
        const res = parts.length > 1 ? child.get(parts.slice(1).join('.')) : child
        return res ?? this.bases.find(x => x.get(id))
    }

    set(id: Id, thing: Thing): void {
        this.dictionary[id] = thing
    }

    toJs(): object {
        throw new Error('TODO!');
    }

}
