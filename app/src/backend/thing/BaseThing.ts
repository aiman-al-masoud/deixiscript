import { thing, colorThing } from '../../config/things';
import BasicContext from '../../facade/context/BasicContext';
import { makeLexeme } from '../../frontend/lexer/Lexeme';
import { Clause, clauseOf, emptyClause } from '../../middle/clauses/Clause';
import { getOwnershipChain } from '../../middle/clauses/functions/getOwnershipChain';
import { getTopLevel } from '../../middle/clauses/functions/topLevel';
import { Id } from '../../middle/id/Id';
import { Map } from '../../middle/id/Map';
import { allKeys } from '../../utils/allKeys';
import { deepCopy } from '../../utils/deepCopy';
import Thing, { CopyOpts, SetArgs, WrapArgs } from './Thing';
import { typeOf } from './typeOf';


export class BaseThing implements Thing {

    readonly id = this.args.id
    protected relations: Relation[] = []
    readonly parent = this.args.parent //container
    readonly object = this.args.object
    protected superclass = this.args.superclass
    protected base = this.args.base
    protected name = this.args.name


    constructor(readonly args: WrapArgs) {

    }

    get(id: Id): Thing | undefined {

        const parts = id.split('.')
        const p1 = parts[0]

        let o

        try {
            o = (this as any)[p1] ?? (this.object as any)?.[p1] ?? this.base?.get(p1)
        } catch {
            return undefined
        }

        if (!o) {
            return undefined
        }

        const w = o instanceof BaseThing ? o : new BaseThing({ object: o, id: `${this.id}.${p1}`, parent: this })
        //memoize

        if (parts.length > 1) {
            return w.get(parts.slice(1).join('.'))
        }

        return w

    }

    copy(opts?: CopyOpts): Thing {

        if (this.object) {
            return new BaseThing({
                id: opts?.id ?? this.id,
                object: deepCopy(this.object),
            })
        }

        if (this.base) {
            return new BaseThing({
                id: opts?.id ?? this.id,
                superclass: this.superclass,
                base: this.base.copy(),
            })
        }

        throw 'TODO!'
    }

    unwrap() {
        return this.object ?? this.base?.unwrap()
    }

    getLexemes = () => {

        const lexemes = this.getAllKeys().flatMap(x => {

            try {

                const o = this.get(x)

                if (o === undefined) {
                    return []
                }

                const unwrapped = o?.unwrap()

                const lex = makeLexeme({
                    type: typeOf(unwrapped),
                    root: x,
                    referent: o,
                })

                return [lex]
            } catch {
                return []
            }


        })

        return lexemes.concat(lexemes.flatMap(l => l.extrapolate()))
    }

    set(predicate: Thing, opts?: SetArgs): Thing[] {

        // console.log(predicate)

        const relation: Relation = { predicate, args: opts?.args ?? [] }

        let added: Relation[] = []
        let removed: Relation[] = []
        let unchanged = this.relations.filter(x => !relationsEqual(x, relation))

        if (opts?.negated) {
            removed = [relation]
        } else if (this.isAlready(relation)) {
            unchanged.push(relation)
        } else {
            added = [relation]
            removed.push(...this.getExcludedBy(relation))
            unchanged = unchanged.filter(x => !removed.some(r => relationsEqual(x, r)))
        }

        added.forEach(r => this.addRelation(r))
        removed.forEach(r => this.removeRelation(r))

        return this.reinterpret(added, removed, unchanged)
    }

    protected reinterpret(added: Relation[], removed: Relation[], kept: Relation[]): Thing[] {

        removed.forEach(r => {
            this.undo(r)
        })

        added.forEach(r => {
            this.do(r)
        })

        kept.forEach(r => {
            this.keep(r)
        })

        return []
    }

    protected getExcludedBy(relation: Relation): Relation[] {
        return [] //TODO
    }

    protected do(relation: Relation) {
        // console.log((relation.predicate as BetterBaseThing).superclass === colorThing )

        if ((relation.predicate as BaseThing).superclass === colorThing) {
            const style = this.get('style')?.unwrap()
            style.background = relation.predicate.unwrap()
        }

        this.inherit(relation.predicate)
    }

    protected undo(relation: Relation) {
        this.disinherit(relation.predicate)
    }

    protected keep(relation: Relation) {

    }

    protected addRelation(relation: Relation) {
        this.relations.push(relation)
    }

    protected removeRelation(relation: Relation) {
        this.relations = this.relations.filter(x => !relationsEqual(relation, x))
    }

    protected isAlready(relation: Relation): boolean {
        return (!relation.args.length && relation.predicate === this)
            || this.relations.some(x => relationsEqual(x, relation))
    }

    protected inherit(added: Thing) {

        //TODO: prevent re-creation of existing DOM elements

        this.base = added.copy()
        this.superclass = added

        if (this.base.unwrap() instanceof HTMLElement && this.parent instanceof BasicContext) {
            this.parent.root?.appendChild(this.base.unwrap())
        }

    }

    protected disinherit(expelled: Thing) {
        if (this.superclass === expelled) {

            if (this.base?.unwrap() instanceof HTMLElement && this.parent instanceof BasicContext) {
                this.parent.root?.removeChild(this.base.unwrap())
            }

            this.base = thing.copy()
            this.superclass = thing

        }
    }

    getAllKeys = () => allKeys(this.object ?? {}).concat(allKeys(this.base?.unwrap() ?? {})).concat(allKeys(this))

    pointOut(doIt: boolean): void {
        const x = this.base?.unwrap()
        if (x instanceof HTMLElement) {
            x.style.outline = doIt ? '#f00 solid 2px' : ''
        }
    }


    // -----------------evil starts below------------------------------------
    toClause(query?: Clause) {

        const queryOrEmpty = query ?? emptyClause

        const fillerClause = clauseOf(makeLexeme({ root: this.id.toString(), type: 'noun' }), this.id) //TODO

        const res = queryOrEmpty
            .flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => this.isAlready({ predicate: x.predicate?.referent!, args: [] }))
            .map(x => x.copy({ map: { [x.args![0]]: this.id } }))
            .concat(fillerClause)
            .reduce((a, b) => a.and(b), emptyClause)
            .and(this.ownerInfo(queryOrEmpty))


        // console.log(res.toString())
        return res
    }

    protected ownerInfo(q: Clause) {

        //TODO: this unwittinlgy asserts wrong non-relational info about this object "parroting the query".

        const maps = this.query(q)
        const res = (maps[0] && getOwnershipChain(q, getTopLevel(q)[0]).length > 1) ?
            q.copy({ map: maps[0] })
            : emptyClause

        // console.log(res.toString())
        return res
    }

    query(clause: Clause, parentMap: Map = {}): Map[] {

        const oc = getOwnershipChain(clause, getTopLevel(clause)[0])
        // console.log('clause=', clause.toString(), 'oc=', oc, 'name=', this.name)

        if (oc.length === 1) { //BASECASE: check yourself
            //TODO: also handle non-ownership non-intransitive relations!
            //TODO: handle non BasicClauses!!!! (that don't have ONE predicate!)
            // if (clause.simple.predicate && (this.is(clause.simple.predicate) || this.name === clause.simple.predicate?.root)) {

            if (this.object === clause.simple.predicate?.referent?.unwrap()) { //this.name === clause.simple.predicate?.root    
                return [{ ...parentMap, [clause.entities[0]]: this.id }]
            }

            return [] //TODO
        }

        // check your children!

        const top = getTopLevel(clause)

        const peeled = clause.flatList()
            .filter(x => x.entities.every(e => !top.includes(e)))
            .reduce((a, b) => a.and(b), emptyClause)

        const relevantNames = /* or clause??? */peeled.flatList().flatMap(x => [x.predicate?.root, x.predicate?.token]).filter(x => x).map(x => x as string)

        const children: Thing[] = this.getAllKeys()
            .map(x => ({ name: x, obj: this.get(x)?.unwrap() }))
            .filter(x => relevantNames.includes(x.name)) // performance
            .filter(x => x.obj !== this.object)
            .map(x => new BaseThing({ object: x.obj, id: `${this.id}.${x.name}`, parent: this, name: x.name }))


        const res = children.flatMap(x => x.query(peeled, { [top[0]]: this.id }))


        return res

    }
    // -----------evil ends ---------------------------------------


}


type Relation = {
    predicate: Thing,
    args: Thing[],//implied subject = this object
}

function relationsEqual(r1: Relation, r2: Relation) {
    return r1.predicate === r2.predicate
        && r1.args.length === r2.args.length
        && r1.args.every((x, i) => r2.args[i] === x)
}