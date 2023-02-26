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

    readonly aliases: { [alias: string]: string[] } = this.object?.aliases ?? {}
    readonly simplePredicates: Lexeme[] = []

    constructor(
        readonly object: any,
        readonly id: Id,
        readonly isPlaceholder: boolean,
        readonly parent?: Wrapper,
        readonly name?: string
    ) {

        try {
            this.object.aliases = this.aliases
            this.object.simplePredicates = this.simplePredicates
        } catch { }


    }

    is(predicate: Lexeme): boolean {

        const path = this.aliases[predicate.concepts?.at(0) ?? '']

        return path ?
            this.getNested(path) === predicate.root :
            this.isSimplePredicate(predicate)

    }

    protected isSimplePredicate(predicate: Lexeme) {
        return this.simplePredicates.map(x => x.root).includes(predicate.root)
    }

    protected setAlias(alias: Lexeme, path: Lexeme[]): void {
        this.aliases[alias.root] = path.map(x => x.root)
    }

    protected call(verb: Lexeme, args: Wrapper[]) {//TODO: alias
        return this.object[verb.root](...args.map(x => x.unwrap()))
    }

    clause(query?: Clause): Clause {

        const preds: Lexeme[] =
            Object.keys(this.aliases)
                .map(k => this.getNested(this.aliases[k]))
                .map((x): Lexeme => (makeLexeme({ root: x, type: 'adjective' })))
                .concat(this.simplePredicates)

        let res = preds
            .map(x => clauseOf(x, this.id))
            .reduce((a, b) => a.and(b), emptyClause)

        return res.and(this.extraInfo(query))

    }

    protected extraInfo(query?: Clause) {

        if (query) {
            const oc = getOwnershipChain(query, getTopLevel(query)[0])
            const path = oc.map(x => query.describe(x)?.[0]?.root).slice(1)
            const nested = this.getNested(this.aliases?.[path?.[0]] ?? path)

            if (nested !== undefined) {
                const data = query.copy({ map: { [oc[0]]: this.id } })
                return data
            }
        }

        return emptyClause
    }

    set(predicate: Lexeme, opts?: SetOps): any {

        if (opts?.args) {
            return this.call(predicate, opts.args)
        }

        if (opts?.aliasPath) {
            return this.setAlias(predicate, opts.aliasPath)
        }

        if (this.parent) {
            return this.parent.set(predicate, { props: [...opts?.props ?? [], this.name!].reverse() })
        }

        const props = opts?.props ?? []
        const last = props.at(-1)!
        const path = props.length > 0 ?
            [...props.slice(0, -1), ...this.aliases[last] ?? [last]] :
            this.aliases[predicate?.concepts?.[0]!]

        this.setMultiProp(path, predicate, opts)

    }

    protected setMultiProp(path: string[], value: Lexeme, opts?: SetOps) {

        if (!path) {
            const val = value.root

            if (typeof this.object[val] === 'boolean') {
                this.object[val] = !opts?.negated
            } else {
                this.simplePredicates.push(value)
            }

        } else {
            const val = !opts?.negated ? value.root : opts?.negated && this.is(value) ? '' : this.getNested(path)
            this.setNested(path, val)
        }

    }

    protected setNested(path: string[], value: string) {

        if (typeof this.getNested(path) !== typeof value) { //TODO: remove!
            return
        }

        if (path.length === 1) {
            this.object[path[0]] = value
            return
        }

        let x = this.object[path[0]]

        path.slice(1, -2).forEach(p => {
            x = x[p]
        })

        x[path.at(-1) as string] = value
    }

    protected getNested(path: string[]) {

        let x = this.object[path[0]] // assume at least one

        path.slice(1).forEach(p => {
            x = x?.[p]
        })

        return x

    }

    copy(opts?: CopyOpts): Wrapper {

        const copy = new BaseWrapper(
            opts?.object ?? deepCopy(this.object),
            this.id,
            opts?.object ? false : this.isPlaceholder,
        )

        this.simplePredicates.forEach(x => copy.set(x))
        return copy
    }

    get(clause: Clause): Wrapper | undefined {

        const x = clause.entities.flatMap(e => clause.describe(e))[0]

        if (x) {
            const path = this.aliases?.[x.root] ?? [x.root]
            let parent: Wrapper = this

            path.forEach(p => {
                const o = parent.unwrap()[p]
                parent = new BaseWrapper(o, getIncrementalId(), false, parent, p)
            })

            return parent

        }

    }

    dynamic(): Lexeme[] {
        return allKeys(this.object).map(x => {
            return makeLexeme({ type: typeOf(this.object[x]), root: x })
        })
    }

    unwrap(): object | undefined {
        return this.object
    }

}