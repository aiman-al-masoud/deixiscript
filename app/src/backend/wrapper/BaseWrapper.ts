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
        this.object[predicate?.concepts?.[0]!] === predicate.root
        || this.predicates.map(x => x.root).includes(predicate.root)

    protected call(verb: Lexeme, args: Wrapper[]) {
        return this.object[verb.root](...args.map(x => x.unwrap()))
    }

    toClause(query?: Clause) {

        const ks = this.predicates.flatMap(x => x.heirlooms.flatMap(x => x.name))

        return ks
            .map(x => this.object[x])
            .map(x => makeLexeme({ root: x, type: 'adjective' }))
            .concat(this.predicates)
            .map(x => clauseOf(x, this.id))
            .reduce((a, b) => a.and(b), emptyClause)
            .and(this.extraInfo(query ?? emptyClause))

    }

    protected extraInfo(q: Clause) {

        const oc = getOwnershipChain(q, getTopLevel(q)[0])
        const lx = oc.flatMap(x => q.describe(x)).filter(x => x.type === 'noun').slice(1)[0]
        const nested = this.object[lx?.concepts?.[0] ?? lx?.root]

        //without filter, q.copy() ends up asserting wrong information about this object,
        //you need to assert only ownership of given props if present,
        //not everything else that may come with query q. 

        const filteredq = q.flatList().filter(x => !(x?.args?.[0] === oc[0] && x.args?.length === 1)).reduce((a, b) => a.and(b), emptyClause)
        return nested !== undefined ? filteredq.copy({ map: { [oc[0]]: this.id } }) : emptyClause

    }

    set(predicate: Lexeme, opts?: SetOps): any {

        if (opts?.args) {
            return this.call(predicate, opts.args)
        }

        if (this.parent && typeof this.object !== 'object') {
            return this.parent.unwrap()[this.name!] = predicate.root
        }

        this.setMultiProp(predicate, opts)

    }

    protected setMultiProp(value: Lexeme, opts?: SetOps) {

        const hasProp =
            this.object[value?.concepts?.[0]!] !== undefined
            || this.object[value.root] !== undefined

        if (hasProp) {

            const val = typeof this.object[value.root] === 'boolean' ? !opts?.negated
                : !opts?.negated ? value.root
                    : opts?.negated && this.is(value) ? ''
                        : this.object[value.concepts?.[0] ?? value.root]

            this.object[value?.concepts?.[0]! ?? value.root] = val

        } else {

            if (!this.is(value)) {
                this.predicates.push(value)
            }

            value.heirlooms.forEach(h => {
                Object.defineProperty(this.object, h.name, h)
            })

        }

    }

    copy = (opts?: CopyOpts) => new BaseWrapper(
        opts?.object ?? deepCopy(this.object),
        this.id,
        (opts?.preds ?? []).concat(this.predicates)
    )

    get(predicate: Lexeme): Wrapper | undefined {

        const x = predicate

        if (x) {

            const aliases = this.predicates.flatMap(x => x.heirlooms).map(x => ({ [x.name]: x.path })).reduce((a, b) => ({ ...a, ...b }), {})
            const path = aliases?.[x.root] ?? [x.root]
            let parent: Wrapper = this

            path.forEach(p => {
                const o = parent.unwrap()[p]
                parent = new BaseWrapper(o, getIncrementalId(), [], parent, p)
            })

            return parent

        }

    }

    dynamic = () => allKeys(this.object).map(x => makeLexeme({
        type: typeOf(this.object[x]),
        root: x
    }))

    unwrap = () => this.object

}