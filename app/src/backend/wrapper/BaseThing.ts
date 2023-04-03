import { Id } from "../../middle/id/Id";
import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme";
import { Heirloom } from "./Heirloom";
import Thing, { CopyOpts, SetOps, wrap } from "./Thing";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { allKeys } from "../../utils/allKeys";
import { Clause, clauseOf, emptyClause } from "../../middle/clauses/Clause";
import { getOwnershipChain } from "../../middle/clauses/functions/getOwnershipChain";
import { getTopLevel } from "../../middle/clauses/functions/topLevel";
import { typeOf } from "./typeOf";
import { deepCopy } from "../../utils/deepCopy";
import { Map } from "../../middle/id/Map";
import { makeSetter } from "./makeSetter";
import { uniq } from "../../utils/uniq";


type Relation = { predicate: Lexeme, args: Thing[] } //implied subject = this object



function relationsEqual(r1: Relation, r2: Relation) {
    return r1.predicate.root === r2.predicate.root
        && r1.args.length === r2.args.length
        && r1.args.every((x, i) => r2.args[i] === x)
}


export default class BaseThing implements Thing {

    constructor(
        protected object: any,
        readonly id: Id,
        readonly parent?: Thing,
        readonly name?: string,
        readonly heirlooms: Heirloom[] = [],
        protected relations: Relation[] = [],
    ) { }

    protected is = (predicate: Lexeme) =>
        // this.predicates.map(x => x.root).includes(predicate.root)
        // this.getConcepts().includes(predicate.root) //TODO also from supers
        this.relations.filter(x => x.args.length === 0).map(x => x.predicate).map(x => x.root).includes(predicate.root)

    protected isAlready(relation: Relation) {
        return this.relations.filter(x => relationsEqual(x, relation)).length
    }

    set(predicate: Lexeme, opts?: SetOps): Thing | undefined {

        const relation: Relation = { predicate, args: opts?.args ?? [] }

        let added: Relation[] = []
        let removed: Relation[] = []
        let unchanged = this.relations.filter(x => !relationsEqual(x, relation))

        if (!opts?.negated && this.isAlready(relation)) {
            unchanged.push(relation)
        } else if (opts?.negated) {
            removed = [relation]
        } else {
            added = [relation]
            removed.push(...this.getMutex(added))
            unchanged = unchanged.filter(x => !removed.some(r => relationsEqual(x, r)))
        }

        added.forEach(r => this.addRelation(r))
        removed.forEach(r => this.removeRelation(r))

        // console.log('added=', added, 'removed=', removed, 'unchanged=', unchanged) 
        return this.reinterpret(added, removed, unchanged, opts)
    }

    protected getMutex(added: Relation[]): Relation[] {

        const newOne = added[0].predicate

        if (newOne.referent?.getConcepts().includes('color')) {
            return this.relations.filter(x => !x.args.length).filter(x => (x.predicate.referent !== this) && (x.predicate.referent?.getConcepts().includes('color')) && (x.predicate.root !== newOne.root))
        }

        return []
    }

    protected addRelation(relation: Relation) {
        this.relations.push(relation)
    }

    protected removeRelation(relation: Relation) {
        this.relations = this.relations.filter(x => !relationsEqual(x, relation))
    }

    protected reinterpret(added: Relation[], removed: Relation[], unchanged: Relation[], opts?: SetOps) {

        //TODO!!!!!! Don't pass down opts to everyone!!! if opts.negated 
        // goes into added/unchanged that's a BUUUUUUUUUUG!!!!!!!!

        removed.forEach(p => {
            this.doSideEffects(p.predicate, opts)
            this.removeHeirlooms(p.predicate)
        })

        added.forEach(p => {
            this.doSideEffects(p.predicate, opts)
            this.addHeirlooms(p.predicate)
        })

        unchanged.forEach(p => {
            this.doSideEffects(p.predicate, opts) //TODO! restore heirlooms
        })

        return undefined
    }

    protected doSideEffects(predicate: Lexeme, opts?: SetOps) {

        const prop = this.canHaveA(predicate)

        if (predicate.isVerb) {
            return this.call(predicate, opts?.args!)//TODO
        } else if (prop) { // has-a
            const val = typeof this._get(predicate.root) === 'boolean' ? !opts?.negated : !opts?.negated ? predicate.root : opts?.negated && this.is(predicate) ? '' : this._get(prop)
            this.object[prop] = val
        } else if (this.parent) { // child is-a, parent has-a
            const parent = this.parent.unwrap?.() ?? this.parent
            if (typeof this.object !== 'object') parent[this.name!] = predicate.root //TODO: negation
            // this.parent?.set(predicate, opts) // TODO: set predicate on parent? 
        } else { // is-a
            this.beA(predicate, opts)
        }

    }

    protected addHeirlooms(predicate: Lexeme) {
        predicate.referent?.getHeirlooms().forEach(h => {
            Object.defineProperty(this.object, h.name, h)
        })
    }

    protected removeHeirlooms(predicate: Lexeme) {
        predicate.referent?.getHeirlooms().forEach(h => {
            delete this.object[h.name]
        })
    }

    protected inherit = (value: Lexeme, opts?: SetOps) => {

        const copy = value.referent?.copy({ id: this.id }).unwrap()

        if (!copy || value.referent === this || Object.getPrototypeOf(this.object) === Object.getPrototypeOf(copy) /* don't recreate */) {
            return
        }

        this.object = copy

        if (this.object instanceof HTMLElement) {
            this.object.id = this.id + ''
            opts?.context?.root?.appendChild(this.object)
        }

        if (this.object instanceof HTMLElement && !this.object.children.length) {
            this.object.textContent = 'default'
        }

    }

    protected disinherit = (value: Lexeme, opts?: SetOps) => {

    }

    protected canHaveA(value: Lexeme) { //returns name of prop corresponding to Lexeme if any
        const concepts = [...value.referent?.getConcepts() ?? [], value.root]
        return concepts.find(x => this._get(x) !== undefined)
    }

    protected beA(value: Lexeme, opts?: SetOps) {
        opts?.negated ? this.disinherit(value, opts) : this.inherit(value, opts)
    }

    //-----------------------------------------------------------

    getConcepts(): string[] {
        return uniq(this.relations.filter(x => !x.args.length).map(x => x.predicate).flatMap(x => {
            return x.referent === this ? [x.root] : x.referent?.getConcepts() ?? []
        }))
    }

    copy = (opts?: CopyOpts) => new BaseThing(
        opts?.object ?? deepCopy(this.object),
        opts?.id ?? this.id, //TODO: keep old by default?
    )

    getLexemes = () => {

        const lexemes = allKeys(this.object).map(x => makeLexeme({
            type: typeOf(this._get(x)),
            root: x
        }))

        return lexemes.concat(lexemes.flatMap(l => l.extrapolate()))
    }


    unwrap = () => this.object

    protected refreshHeirlooms() {
        this.relations.map(x => x.predicate).forEach(p => p.referent?.getHeirlooms().forEach(h => {
            Object.defineProperty(this.object, h.name, h)
        }))
    }

    getHeirlooms(): Heirloom[] {
        return this.heirlooms
    }

    protected call(verb: Lexeme, args: Thing[]) {
        const method = this._get(verb.root) as Function

        if (!method) {
            return
        }

        const result = method.call(this.object, ...args.map(x => x.unwrap()))
        return wrap({ id: getIncrementalId(), object: result })
    }





    // --------------------------------------------------------------------


    protected ownerInfo(q: Clause) {
        const maps = this.query(q)
        return (maps[0] && getOwnershipChain(q, getTopLevel(q)[0]).length > 1) ? q.copy({ map: maps[0] }) : emptyClause
    }

    toClause(query?: Clause) {
        const queryOrEmpty = query ?? emptyClause

        const fillerClause = clauseOf(makeLexeme({ root: this.id.toString(), type: 'noun' }), this.id) //TODO
        const nameClause = this.name ? clauseOf(makeLexeme({ root: this.name, type: 'noun' }), this.id) : emptyClause //TODO
        const relStuff = this.relations.filter(x => x.args.length > 0).map(x => clauseOf(x.predicate, ...[this.id, ...x.args.map(x => x.id)])).reduce((a, b) => a.and(b), emptyClause)

        const res = queryOrEmpty.flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => this.is(x.predicate as Lexeme))
            .map(x => x.copy({ map: { [x.args![0]]: this.id } }))
            .concat(fillerClause)
            .reduce((a, b) => a.and(b), emptyClause)
            .and(this.ownerInfo(queryOrEmpty))
            .and(relStuff)
            .and(nameClause)

        return res
    }

    setAlias = (name: string, path: string[]) => {

        this.heirlooms.push({
            name,
            set: makeSetter(path),
            get: makeGetter(path),
            configurable: true,
        })

    }

    get(id: Id): Thing | undefined {

        const parts = id.split('.')
        const p1 = parts[0]
        const o = this.object[p1]
        const w = o instanceof BaseThing ? o : new BaseThing(o, `${this.id}.${p1}`, this, p1) //TODO:check id!

        if (parts.length > 1) {
            return w.get(parts.slice(1).join('.'))
        }

        return w
    }

    protected _get(key: string) {

        try {
            this.refreshHeirlooms() //TODO!
            const val = this.object?.[key]
            return val?.unwrap?.() ?? val
        } catch {

        }

    }

    query(clause: Clause, parentMap: Map = {}): Map[] {

        const oc = getOwnershipChain(clause, getTopLevel(clause)[0])
        // console.log('clause=', clause.toString(), 'oc=', oc, 'name=', this.name)

        if (oc.length === 1) { //BASECASE: check yourself
            //TODO: also handle non-ownership non-intransitive relations!
            //TODO: handle non BasicClauses!!!! (that don't have ONE predicate!)
            if (clause.simple.predicate && (this.is(clause.simple.predicate) || this.name === clause.simple.predicate?.root)) {
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

        const children: Thing[] = allKeys(this.object)
            .map(x => ({ name: x, obj: this._get(x) }))
            .filter(x => relevantNames.includes(x.name)) // performance
            .filter(x => x.obj !== this.object)
            .map(x => new BaseThing(x.obj, `${this.id}.${x.name}`, this, x.name))

        const res = children.flatMap(x => x.query(peeled, { [top[0]]: this.id }))
        return res

    }

}

function getNested(object: any, path: string[]) {

    if (!object[path[0]]) {
        return undefined
    }

    let x = wrap({ object: object[path[0]], id: getIncrementalId(), parent: object, name: path[0] })

    path.slice(1).forEach(p => {
        const y = x.unwrap()[p]
        x = wrap({ object: y, id: getIncrementalId(), parent: x, name: p })
    })

    return x

}

export function makeGetter(path: string[]) {

    function f(this: any) {
        return getNested(this, path)
    }

    return f
}

// ---------------------------------------------------------------