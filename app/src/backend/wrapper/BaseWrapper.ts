import { Id } from "../../middle/id/Id";
import { Lexeme, makeLexeme } from "../../frontend/lexer/Lexeme";
import Wrapper, { CopyOpts, SetOps } from "./Wrapper";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { allKeys } from "../../utils/allKeys";
import { Clause, clauseOf, emptyClause } from "../../middle/clauses/Clause";
import { getOwnershipChain } from "../../middle/clauses/functions/getOwnershipChain";
import { getTopLevel } from "../../middle/clauses/functions/topLevel";
import { typeOf } from "./typeOf";
import { deepCopy } from "../../utils/deepCopy";

export default class BaseWrapper implements Wrapper {

    readonly predicates: Lexeme[] = []

    constructor(
        readonly object: any,
        readonly id: Id,
        preds: Lexeme[],
        readonly parent?: Wrapper,
        readonly name?: string
    ) {
        preds.forEach(p => this.set(p))
    }

    is = (predicate: Lexeme) =>
        this._get(predicate?.concepts?.[0]!) === predicate.root
        || this.predicates.map(x => x.root).includes(predicate.root)

    protected call(verb: Lexeme, args: Wrapper[]) {
        const method = this._get(verb.root) as Function
        return method.call(this.object, ...args.map(x => x.unwrap()))
    }

    toClause(query?: Clause) {

        const ks = this.predicates.flatMap(x => x.heirlooms.flatMap(x => x.name))

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
        const nested = this._get(lx?.concepts?.[0] ?? lx?.root)
        const filteredq = q.flatList().filter(x => !(x?.args?.[0] === oc[0] && x.args?.length === 1)).reduce((a, b) => a.and(b), emptyClause) /* without filter, q.copy() ends up asserting wrong information about this object, you need to assert only ownership of given props if present, not everything else that may come with query q.  */
        return nested !== undefined ? filteredq.copy({ map: { [oc[0]]: this.id } }) : emptyClause
    }

    set(predicate: Lexeme, opts?: SetOps): any {

        if (opts?.args) {
            return this.call(predicate, opts.args)
        }

        this._set(predicate, opts)

    }

    protected _set(value: Lexeme, opts?: SetOps) {

        if (this.parent && typeof this.object !== 'object') { //has-a
            const parent = this.parent.unwrap?.() ?? this.parent
            return parent[this.name!] = value.root //TODO: negation
        }

        const prop = value?.concepts?.[0] ?? value.root

        if (this._get(prop) !== undefined) { // has-a
            const val = typeof this._get(value.root) === 'boolean' ? !opts?.negated : !opts?.negated ? value.root : opts?.negated && this.is(value) ? '' : this._get(prop)
            this.object[prop] = val
        } else { // is-a
            this.inherit(value)
        }

    }

    protected _get(key: string) {
        const val = this.object[key]
        return val?.unwrap?.() ?? val
    }

    protected inherit(value: Lexeme) {
        this.predicates.push(value)
        value.heirlooms.forEach(h => { Object.defineProperty(this.object, h.name, h) })
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

    dynamic = () => allKeys(this.object).map(x => makeLexeme({
        type: typeOf(this._get(x)),
        root: x
    }))

    unwrap = () => this.object

}