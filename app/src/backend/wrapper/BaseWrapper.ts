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
import { setNested } from "../../utils/setNested";
import { getNested } from "../../utils/getNested";

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

    protected get aliases(): { [alias: string]: string[] } {
        return this.predicates.map(x => x.aliases).reduce((a, b) => ({ ...a, ...b }), {})
    }

    is(predicate: Lexeme): boolean {

        const path = this.aliases[predicate.concepts?.at(0) ?? '']

        return path ?
            getNested(this.object, path) === predicate.root :
            this.predicates.map(x => x.root).includes(predicate.root)

    }

    protected call(verb: Lexeme, args: Wrapper[]) {//TODO: alias
        return this.object[verb.root](...args.map(x => x.unwrap()))
    }

    toClause(query?: Clause) {

        return Object.keys(this.aliases)
            .map(k => getNested(this.object, this.aliases[k]))
            .map(x => makeLexeme({ root: x, type: 'adjective' }))
            .concat(this.predicates)
            .map(x => clauseOf(x, this.id))
            .reduce((a, b) => a.and(b), emptyClause)
            .and(this.extraInfo(query ?? emptyClause))

    }

    protected extraInfo(q: Clause) {

        const oc = getOwnershipChain(q, getTopLevel(q)[0])
        const path = oc.flatMap(x => q.describe(x)).filter(x => x.type === 'noun').map(x => x.root).slice(1)
        const nested = getNested(this.object, this.aliases?.[path?.[0]] ?? path)

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

        const path =
            this.aliases[value?.concepts?.[0]!]
            ?? (this.object[value.root] !== undefined ? [value.root] : undefined)

        if (path) {
            const val = typeof this.object[value.root] === 'boolean' ? !opts?.negated : !opts?.negated ? value.root : opts?.negated && this.is(value) ? '' : getNested(this.object, path)
            setNested(this.object, path, val)
        } else {
            this.predicates.push(value)
        }

    }

    copy(opts?: CopyOpts): Wrapper {

        const copy = new BaseWrapper(
            opts?.object ?? deepCopy(this.object),
            this.id,
            (opts?.preds ?? []).concat(this.predicates)
        )

        this.predicates.forEach(x => copy.set(x))
        return copy
    }

    get(clause: Clause): Wrapper | undefined {

        const x = clause.entities.flatMap(e => clause.describe(e))[0]

        if (x) {
            const path = this.aliases?.[x.root] ?? [x.root]
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