import { thing, colorThing } from '../../config/things';
import BasicContext from '../../facade/context/BasicContext';
import { Context } from '../../facade/context/Context';
import { makeLexeme } from '../../frontend/lexer/Lexeme';
import { Clause, emptyClause } from '../../middle/clauses/Clause';
import { Id } from '../../middle/id/Id';
import { Map } from '../../middle/id/Map';
import { allKeys } from '../../utils/allKeys';
import { deepCopy } from '../../utils/deepCopy';
import { ownerInfo } from './ownerInfo';
import Thing, { CopyOpts, Relation, relationsEqual, SetArgs, WrapArgs } from './Thing';
import { typeOf } from './typeOf';


export class BaseThing implements Thing {

    readonly id = this.args.id
    protected relations: Relation[] = []
    protected parent = this.args.parent //container
    readonly object = this.args.object
    protected superclass = this.args.superclass
    protected base = this.args.base


    constructor(readonly args: WrapArgs) {

    }

    get = (id: Id): Thing | undefined => {

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

    copy = (opts?: CopyOpts): Thing => {

        return new BaseThing({
            id: opts?.id ?? this.id,
            object: this.object ? deepCopy(this.object) : undefined,
            superclass: this.superclass,
            base: this.base?.copy(),
        })

    }

    getLexemes = () => {

        return this.getAllKeys().flatMap(x => {

            let child = this.get(x)

            if (!child) {
                return []
            }

            const lex = makeLexeme({
                type: typeOf(child.unwrap()),
                root: x,
                // referent: child,
            })

            return [lex, ...lex.extrapolate()]
        })

    }

    set = (predicate: Thing, opts?: SetArgs): Thing[] => {

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

    protected reinterpret = (added: Relation[], removed: Relation[], kept: Relation[]): Thing[] => {

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

    protected getExcludedBy = (relation: Relation): Relation[] => {
        return [] //TODO
    }

    protected do = (relation: Relation) => {

        if ((relation.predicate as BaseThing).superclass === colorThing) {
            this.refreshColor(relation)
            return
        }

        this.inherit(relation.predicate)
    }

    protected refreshColor = (relation: Relation) => {
        const style = this.get('style')?.unwrap()
        style ? style.background = relation.predicate.unwrap() : 0
        return
    }

    protected undo = (relation: Relation) => {
        this.disinherit(relation.predicate)
    }

    protected keep = (relation: Relation) => {
        this.refreshColor(relation)
    }

    protected addRelation = (relation: Relation) => {
        this.relations.push(relation)
    }

    protected removeRelation = (relation: Relation) => {
        this.relations = this.relations.filter(x => !relationsEqual(relation, x))
    }

    isAlready = (relation: Relation): boolean => {
        return (!relation.args.length && this.equals(relation.predicate))
            || this.relations.some(x => relationsEqual(x, relation))
    }

    protected inherit = (added: Thing) => {
        //TODO: prevent re-creation of existing DOM elements
        this.base = added.copy({ id: this.id })
        this.superclass = added
    }

    protected disinherit = (expelled: Thing) => {
        if (this.superclass === expelled) {

            if (this.base?.unwrap() instanceof HTMLElement && this.parent instanceof BasicContext) {
                this.parent.root?.removeChild(this.base.unwrap())
            }

            this.base = thing.copy()
            this.superclass = thing

        }
    }

    getAllKeys = () => allKeys(this.object ?? {}).concat(allKeys(this.base?.unwrap() ?? {})).concat(allKeys(this))

    pointOut = (doIt: boolean): void => {
        const x = this.base?.unwrap()
        if (x instanceof HTMLElement) {
            x.style.outline = doIt ? '#f00 solid 2px' : ''
        }
    }

    // -----------------evil starts below------------------------------------
    toClause = (query?: Clause) => {
        const queryOrEmpty = query ?? emptyClause
        const res = queryOrEmpty
            .flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => this.isAlready({ predicate: x.predicate?.referent!, args: [] }))
            .map(x => x.copy({ map: { [x.args![0]]: this.id } }))
            .reduce((a, b) => a.and(b), emptyClause)
            .and(ownerInfo(this, queryOrEmpty))
        return res
    }

    query = (clause: Clause): Map[] => {
        return []
    }
    // -----------evil ends ---------------------------------------

    equals = (other: Thing): boolean => {
        return other && this.unwrap() === other.unwrap()
    }

    unwrap = () => {
        return this.object ?? this.base?.unwrap()
    }

    setParent = (parent: Context): void => {
        this.parent = parent
        if (this.base?.unwrap() instanceof HTMLElement && this.parent instanceof BasicContext) {
            this.parent.root?.appendChild(this.base.unwrap())
        }
    }

    get name() {
        return this.id.split('.').at(-1)! //TODO
    }

}
