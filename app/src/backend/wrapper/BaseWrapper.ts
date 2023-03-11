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

    protected hasPredicate(predicate: Lexeme) {
        return this.predicates.some(x => x.root === predicate.root)
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

        if (this.parent && typeof this.object !== 'object') {
            const parent = this.parent?.unwrap?.() ?? this.parent
            parent[this.name!] = predicate.root
        }

        this.setMultiProp(predicate, opts)

    }

    protected _get(key: string) {
        const val = this.object[key]
        return val instanceof BaseWrapper ? val.unwrap() : val
    }

    protected setMultiProp(value: Lexeme, opts?: SetOps) {

        const hasProp =
            this._get(value?.concepts?.[0]!) !== undefined
            || this._get(value.root) !== undefined

        if (hasProp) {

            const val = typeof this._get(value.root) === 'boolean' ? !opts?.negated
                : !opts?.negated ? value.root
                    : opts?.negated && this.is(value) ? ''
                        : this._get(value.concepts?.[0] ?? value.root)

            this.object[value?.concepts?.[0] ?? value.root] = val

        } else {

            if (!this.hasPredicate(value)) {
                this.predicates.push(value)
            }

            value.heirlooms.forEach(h => {

                const object = typeof this.object === 'object' ? this.object : this.object.constructor.prototype
                Object.defineProperty(object, h.name, h)

            })

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

    dynamic = () => allKeys(this.object).map(x => makeLexeme({
        type: typeOf(this._get(x)),
        root: x
    }))

    unwrap = () => this.object

}