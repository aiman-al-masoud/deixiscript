import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { getOwnershipChain } from "../clauses/functions/getOwnershipChain";
import { Id } from "../clauses/Id";
import { LexemeType } from "../config/LexemeType";
import { Lexeme } from "../lexer/Lexeme";
import Wrapper, { CopyOpts, SetOps, unwrap } from "./Wrapper";

export default class BaseWrapper implements Wrapper {

    constructor(
        readonly object: any,
        readonly id: Id,
        readonly isPlaceholder: boolean,
        readonly aliases: { [alias: string]: { path: string[], lexeme: Lexeme } } = object.aliases ?? {},
        readonly simplePredicates: Lexeme[] = []) {

        object.aliases = aliases
        object.simplePredicates = simplePredicates
    }

    set(predicate: Lexeme, opts?: SetOps): any {

        if (opts?.args) {
            return this.call(predicate, opts.args)
        }

        if (opts?.aliasPath) {
            return this.setAlias(predicate, opts.aliasPath)
        }

        const props = opts?.props ?? []

        if (this.isPlaceholder) {
            this.setSimplePredicate(predicate)
        } else if (props.length > 1) { // assume > 1 props are a path
            this.setMultiProp(props, predicate, opts)
        } else if (props.length === 1) {
            this.setSingleProp(predicate, props[0], opts)
        } else if (props.length === 0) {
            this.setZeroProps(predicate, opts)
        }

    }

    protected setMultiProp(path: Lexeme[], value: Lexeme, opts?: SetOps) { // assume not concept

        if (opts?.negated && this.is(value)) {
            this.setNested(path.map(x => x.root), '')
        } else {
            this.setNested(path.map(x => x.root), value.root)
        }

    }

    is(predicate: Lexeme): boolean {

        const path = this.aliases[predicate.concepts?.at(0) ?? '']?.path

        return path ?
            this.getNested(path) === predicate.root :
            this.isSimplePredicate(predicate)

    }

    protected isSimplePredicate(predicate: Lexeme) {
        return this.simplePredicates.map(x => x.root).includes(predicate.root)
    }

    protected setAlias(conceptName: Lexeme, propPath: Lexeme[]): void {
        this.aliases[conceptName.root] = { path: propPath.map(x => x.root), lexeme: conceptName }
    }

    protected call(verb: Lexeme, args: Wrapper[]) {
        const concept = this.aliases[verb.root]?.path
        const methodName = concept?.[0] ?? verb.root
        return this?.object[methodName](...args.map(x => unwrap(x)))
    }

    clause(clause?: Clause): Clause {

        const preds: Lexeme[] =
            Object.keys(this.aliases)
                .map(k => this.getNested(this.aliases[k].path))
                .map((x): Lexeme => ({ root: x, type: 'adjective' }))
                .concat(this.simplePredicates)

        return preds
            .map(x => clauseOf(x, this.id))
            .reduce((a, b) => a.and(b), emptyClause)

    }

    protected setSingleProp(value: Lexeme, prop: Lexeme, opts?: SetOps) {

        const path = this.aliases[prop.root]?.path ?? [prop.root]

        if (!opts?.negated) {
            this.setNested(path, value.root)
        } else if (opts?.negated && this.is(value)) {
            this.setNested(path, '')
        }

    }

    protected setZeroProps(predicate: Lexeme, opts?: SetOps) {

        const path = this.aliases[predicate?.concepts?.[0] as any]?.path

        if (path) {

            if (!opts?.negated) {
                this.setNested(path, predicate.root)
            } else if (opts?.negated && this.is(predicate)) {
                this.setNested(path, '')
            }

        } else if (typeof this.object[predicate.root] === 'boolean') {
            this.object[predicate.root] = !opts?.negated
        } else {
            this.setSimplePredicate(predicate)
        }

    }

    protected setSimplePredicate(predicate: Lexeme) {
        this.simplePredicates.push(predicate) //TODO: check duplicates!
    }

    protected setNested(path: string[], value: string) {

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
            x = x[p]
        })

        return x

    }

    typeOf(word: string): LexemeType | undefined {

        const path = this.aliases[word]?.path ?? [word]
        const w = this.getNested(path)

        if (typeof w === 'function') {
            return (w.length ?? 0) > 0 ? 'mverb' : 'iverb'
        }

        if (w === undefined) {
            return undefined
        }

        return 'noun'
    }

    copy(opts?: CopyOpts): Wrapper {

        const copy = new BaseWrapper(
            opts?.object ?? this.copyWrapped(),
            this.id,
            opts?.object ? false : this.isPlaceholder,
        )

        this.simplePredicates.forEach(x => copy.set(x))
        return copy
    }

    protected copyWrapped() {

        if (this.object instanceof HTMLElement) {
            const wrapped = this.object.cloneNode() as HTMLElement
            wrapped.innerHTML = this.object.innerHTML
            return wrapped
        } else {
            return { ...this.object }
        }
    }

}