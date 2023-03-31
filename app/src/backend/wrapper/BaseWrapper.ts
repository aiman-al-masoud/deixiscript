import { Id } from "../../middle/id/Id";
import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme";
import { Heirloom } from "./Heirloom";
import Wrapper, { CopyOpts, SetOps, wrap } from "./Wrapper";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { allKeys } from "../../utils/allKeys";
import { Clause, clauseOf, emptyClause } from "../../middle/clauses/Clause";
import { getOwnershipChain } from "../../middle/clauses/functions/getOwnershipChain";
import { getTopLevel } from "../../middle/clauses/functions/topLevel";
import { typeOf } from "./typeOf";
import { deepCopy } from "../../utils/deepCopy";
import { newInstance } from "../../utils/newInstance";
import { Map } from "../../middle/id/Map";
import { makeGetter } from "./makeGetter";
import { makeSetter } from "./makeSetter";
import { uniq } from "../../utils/uniq";
import { intersection } from "../../utils/intersection";

export default class BaseWrapper implements Wrapper {

    constructor(
        protected object: any,
        readonly id: Id,
        protected predicates: Lexeme[],
        readonly parent?: Wrapper,
        readonly name?: string,
        readonly heirlooms: Heirloom[] = []
    ) { }

    is = (predicate: Lexeme) =>
        this.predicates.map(x => x.root).includes(predicate.root)
    // this.getConcepts().includes(predicate.root) //TODO also from supers

    set(predicate: Lexeme, opts?: SetOps): Wrapper | undefined { //TODO: do something with opts.args!

        let added: Lexeme[] = []
        let removed: Lexeme[] = []
        let unchanged = this.predicates.filter(x => x.root !== predicate.root)

        if (opts?.negated) {
            this.removePredicate(predicate)
            removed = [predicate]
        } else {
            added = [predicate]
            removed.push(...this.getMutex(added))
            unchanged = unchanged.filter(x => !removed.map(x => x.root).includes(x.root))
            this.addPredicate(predicate)
            removed.forEach(x => this.removePredicate(x))
        }

        // console.log('added=',added, 'removed=',removed, 'unchanged=',unchanged)
        return this.reinterpret(added, removed, unchanged, opts)
    }

    protected getMutex(added: Lexeme[]) {
        const a = added[0]

        if (a.referent?.getConcepts()?.includes('color')) {
            return this.predicates.filter(x => (x.referent !== this) && (x.referent?.getConcepts()?.includes('color')) && (x.root !== a.root))
        }
        return []
    }

    protected addPredicate(predicate: Lexeme) {
        this.predicates.push(predicate) //TODO:uniq?
    }

    protected removePredicate(predicate: Lexeme) {
        this.predicates = this.predicates.filter(x => x.root !== predicate.root) //TODO:uniq?
    }

    protected reinterpret(added: Lexeme[], removed: Lexeme[], unchanged: Lexeme[], opts?: SetOps) {

        removed.forEach(p => {
            this.doSideEffects(p, opts)
            this.removeHeirlooms(p)
        })

        added.forEach(p => {
            this.doSideEffects(p, opts)
            this.addHeirlooms(p)
        })

        unchanged.forEach(p => {
            this.doSideEffects(p, opts) //TODO! restore heirlooms
        })

        return undefined
    }

    protected doSideEffects(predicate: Lexeme, opts?: SetOps) {

        const prop = this.canHaveA(predicate)

        if (predicate.isVerb) {
            return this.call(predicate, opts?.args!)
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

        const proto = value.referent?.getProto()

        if (!proto || value.referent === this) {
            return
        }

        if (Object.getPrototypeOf(this.object) === proto) { //don't re-create
            return
        }

        this.object = newInstance(proto, value.root)

        if (this.object instanceof HTMLElement) {
            this.object.id = this.id + ''
            this.object.textContent = 'default'
            opts?.context?.root?.appendChild(this.object)
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
        return uniq(this.predicates.flatMap(x => {
            return x.referent === this ? [x.root] : x.referent?.getConcepts() ?? []
        }))
    }

    getProto(): object | undefined {

        if (!(this.object instanceof HTMLElement)) { //TODO
            return undefined
        }

        return this.object.constructor.prototype
    }

    copy = (opts?: CopyOpts) => new BaseWrapper(
        opts?.object ?? deepCopy(this.object),
        opts?.id ?? this.id, //TODO: keep old by default?
        (opts?.preds ?? []).concat(this.predicates)
    )

    dynamic = () => allKeys(this.object).map(x => makeLexeme({
        type: typeOf(this._get(x)),
        root: x
    }))

    // getAll = ()=> allKeys(this.object).map(x=> new BaseWrapper(this._get(x), 1, [], this)  )

    unwrap = () => this.object

    protected refreshHeirlooms(preds?: Lexeme[]) {
        (preds ?? this.predicates).forEach(p => p.referent?.getHeirlooms().forEach(h => {
            Object.defineProperty(this.object, h.name, h)
        }))
    }

    get(predicate: Lexeme): Wrapper | undefined {
        const w = this.object[predicate.root]
        return w instanceof BaseWrapper ? w : new BaseWrapper(w, getIncrementalId(), [], this, predicate.root)
    }

    protected _get(key: string) {
        this.refreshHeirlooms()
        const val = this.object[key]
        return val?.unwrap?.() ?? val
    }

    setAlias = (name: string, path: string[]) => {

        this.heirlooms.push({
            name,
            set: makeSetter(path),
            get: makeGetter(path),
            configurable: true,
        })

    }

    getHeirlooms(): Heirloom[] {
        return this.heirlooms
    }

    toClause(query?: Clause) {

        const queryOrEmpty = query ?? emptyClause
        const fillerClause = clauseOf(makeLexeme({ root: this.id.toString(), type: 'noun' }), this.id) //TODO

        return queryOrEmpty.flatList()
            .filter(x => x.entities.length === 1 && x.predicate)
            .filter(x => this.is(x.predicate as Lexeme))
            .map(x => x.copy({ map: { [x.args![0]]: this.id } }))
            .concat(fillerClause)
            .reduce((a, b) => a.and(b), emptyClause)
            .and(this.ownerInfo(queryOrEmpty))

    }

    protected ownerInfo(q: Clause) {
        const oc = getOwnershipChain(q, getTopLevel(q)[0])
        const lx = oc.flatMap(x => q.describe(x)).filter(x => x.type === 'noun').slice(1)[0]
        const conceptsAndRoot = [lx?.referent?.getConcepts(), lx?.root].filter(x => x).flat().map(x => x as string)
        const nested = conceptsAndRoot.some(x => this._get(x))
        // without filter, q.copy() ends up asserting wrong information about this object, you need to assert only ownership of given props if present, not everything else that may come with query q. 
        const filteredq = q.flatList().filter(x => !(x?.args?.[0] === oc[0] && x.args?.length === 1)).reduce((a, b) => a.and(b), emptyClause)
        // ids of owned elements need to be unique, or else new unification algo gets confused
        const childMap: Map = oc.slice(1).map(x => ({ [x]: `${this.id}${x}` })).reduce((a, b) => ({ ...a, ...b }), {})
        return nested ? filteredq.copy({ map: { [oc[0]]: this.id, ...childMap } }) : emptyClause
    }

    protected call(verb: Lexeme, args: Wrapper[]) {
        const method = this._get(verb.root) as Function
        const result = method.call(this.object, ...args.map(x => x.unwrap()))
        return wrap({ id: getIncrementalId(), object: result })
    }


}