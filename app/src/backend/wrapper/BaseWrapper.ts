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

export default class BaseWrapper implements Wrapper {

    protected predicates: Lexeme[] = []

    constructor(
        protected object: any,
        readonly id: Id,
        preds: Lexeme[],
        readonly parent?: Wrapper,
        readonly name?: string
    ) {
        preds.forEach(p => this.set(p))
    }

    is = (predicate: Lexeme) => {
        return predicate.referent?.getConcepts()?.some(x => this._get(x) === predicate.root)
            || this.predicates.map(x => x.root).includes(predicate.root)
    }

    protected call(verb: Lexeme, args: Wrapper[]) {
        const method = this._get(verb.root) as Function
        const result = method.call(this.object, ...args.map(x => x.unwrap()))
        return wrap({ id: getIncrementalId(), object: result })
    }

    toClause(query?: Clause) {

        const ks = this.predicates.flatMap(x => (x.referent?.getHeilooms() ?? []).flatMap(x => x.name))

        return ks
            .map(x => this._get(x))
            .map(x => makeLexeme({ root: x, type: 'adjective' }))
            .concat(this.predicates)
            .map(x => clauseOf(x, this.id))
            .reduce((a, b) => a.and(b), emptyClause)
            .and(this.extraInfo(query ?? emptyClause))

    }

    protected extraInfo(q: Clause) {
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

    set(predicate: Lexeme, opts?: SetOps): Wrapper | undefined {

        if (predicate.isVerb) {
            return this.call(predicate, opts?.args!)
        }

        this._set(predicate, opts)

    }

    protected _set(value: Lexeme, opts?: SetOps) {

        if (this.parent && typeof this.object !== 'object') { //has-a
            const parent = this.parent.unwrap?.() ?? this.parent
            return parent[this.name!] = value.root //TODO: negation
        }

        const prop = value?.referent?.getConcepts()?.[0] ?? value.root//TODO!!!! more than one concept

        if (this._get(prop) !== undefined) { // has-a
            const val = typeof this._get(value.root) === 'boolean' ? !opts?.negated : !opts?.negated ? value.root : opts?.negated && this.is(value) ? '' : this._get(prop)
            this.object[prop] = val
        } else { // is-a
            opts?.negated ? this.disinherit(value, opts) : this.inherit(value, opts)
        }

    }

    protected inherit(value: Lexeme, opts?: SetOps) {

        if (this.is(value)) {
            return
        }

        this.predicates.push(value)
        const proto = value.referent?.getProto()

        if (!proto) {
            return
        }

        this.object = newInstance(proto, value.root)
        value.referent?.getHeilooms().forEach(h => Object.defineProperty(this.object, h.name, h))

        const buffer = this.predicates.filter(x => x !== value)
        this.predicates = []
        buffer.forEach(p => this.set(p))
        this.predicates.push(value)

        if (this.object instanceof HTMLElement) {
            this.object.id = this.id + ''
            this.object.textContent = 'default'
            opts?.context?.root?.appendChild(this.object)
        }

    }

    protected disinherit(value: Lexeme, opts?: SetOps) {

        this.predicates = this.predicates.filter(x => x !== value)

        if (this.object instanceof HTMLElement) {
            opts?.context?.root?.removeChild(this.object)
            // TODO: remove this.object, but save predicates
        }

    }

    copy = (opts?: CopyOpts) => new BaseWrapper(
        opts?.object ?? deepCopy(this.object),
        this.id,
        (opts?.preds ?? []).concat(this.predicates)
    )

    get(predicate: Lexeme): Wrapper | undefined {
        const w = this.object[predicate.root]
        return w instanceof BaseWrapper ? w : new BaseWrapper(w, getIncrementalId(), [], this, predicate.root)
    }

    protected _get(key: string) {
        const val = this.object[key]
        return val?.unwrap?.() ?? val
    }

    dynamic = () => allKeys(this.object).map(x => makeLexeme({
        type: typeOf(this._get(x)),
        root: x
    }))

    unwrap = () => this.object










    readonly heirlooms: Heirloom[] = []

    setAlias = (name: string, path: string[]) => {

        this.heirlooms.push({
            name,
            set: makeSetter(path),
            get: makeGetter(path),
        })

    }

    getHeilooms(): Heirloom[] {
        return this.heirlooms
    }

    protected proto?: string

    setProto(proto: string): void {
        this.proto = proto
    }

    getProto(): object | undefined {//TODO: maybe return Object.prototype by default
        return (window as any)?.[this.proto as any]?.prototype
    }

    getConcepts(): string[] {
        return this.predicates.map(x => x.root)
    }

}