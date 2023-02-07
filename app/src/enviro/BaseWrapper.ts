import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import { LexemeType } from "../config/LexemeType";
import { Lexeme } from "../lexer/Lexeme";
import Wrapper, { SetOps } from "./Wrapper";

export default class BaseWrapper implements Wrapper {

    constructor(
        readonly object: any,
        readonly id: Id,
        readonly isPlaceholder: boolean,
        readonly simpleConcepts: { [conceptName: string]: { path: string[], lexeme: Lexeme } } = object.simpleConcepts ?? {},
        readonly simplePredicates: Lexeme[] = []) {

        object.simpleConcepts = simpleConcepts
        object.simplePredicates = simplePredicates
    }

    set(predicate: Lexeme, opts?: SetOps): any {

        if (opts?.args) {
            return this.call(predicate, opts.args)
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

    protected setMultiProp(path: Lexeme[], value: Lexeme, opts?: SetOps) {

        if (opts?.negated && this.is(value)) {
            this.setNested(path.map(x => x.root), '')
        } else {
            this.setNested(path.map(x => x.root), value.root)
        }

    }

    is(predicate: Lexeme): boolean {

        const path = this.simpleConcepts[predicate.concepts?.at(0) ?? '']?.path

        return path ?
            this.getNested(path) === predicate.root :
            this.isSimplePredicate(predicate)

    }

    protected isSimplePredicate(predicate: Lexeme) {
        return this.simplePredicates.map(x => x.root).includes(predicate.root)
    }

    setAlias(conceptName: Lexeme, propPath: Lexeme[]): void {
        this.simpleConcepts[conceptName.root] = { path: propPath.map(x => x.root), lexeme: conceptName }
    }

    pointOut(opts?: { turnOff: boolean; }): void {

        if (this.object instanceof HTMLElement) {
            this.object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
        }

    }

    protected call(verb: Lexeme, args: Wrapper[]) {
        const concept = this.simpleConcepts[verb.root]?.path
        const methodName = concept?.[0] ?? verb.root
        return this?.object[methodName](...args.map(x => x.object))
    }

    get clause(): Clause {

        const preds: Lexeme[] =
            Object.keys(this.simpleConcepts)
                .map(k => this.getNested(this.simpleConcepts[k].path))
                .map((x): Lexeme => ({ root: x, type: 'adjective' }))
                .concat(this.simplePredicates)

        return preds
            .map(x => clauseOf(x, this.id))
            .reduce((a, b) => a.and(b), emptyClause())

    }

    protected setSingleProp(value: Lexeme, prop: Lexeme, opts?: SetOps) {

        const path = this.simpleConcepts[prop.root]?.path

        const val = opts?.negated && this.is(value) ? '' : value.root

        if (path) { // is concept 
            this.setNested(path, val)
        } else { // not concept
            this.setNested([prop.root], val)
        }

    }

    protected setZeroProps(predicate: Lexeme, opts?: SetOps) {

        if (predicate.concepts && predicate.concepts.length > 0) {

            if (!opts?.negated) {
                this.setNested(this.simpleConcepts[predicate.concepts[0]].path, predicate.root)
            } else if (opts?.negated && this.is(predicate)) {
                this.setNested(this.simpleConcepts[predicate.concepts[0]].path, '')
            }

        } else if (typeof this.object[predicate.root] === 'boolean') {
            this.object[predicate.root] = opts?.negated ? false : true
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

        const path = this.simpleConcepts[word]?.path ?? [word]
        const w = this.getNested(path)

        if (typeof w === 'function') {
            return (w.length ?? 0) > 0 ? 'mverb' : 'iverb'
        }

        if (w === undefined) {
            return undefined
        }

        return 'noun'
    }

    // protected copy(): Wrapper {

    //     let wrapped

    //     if (this.object instanceof HTMLElement) {
    //         wrapped = this.object.cloneNode() as HTMLElement
    //         wrapped.innerHTML = this.object.innerHTML
    //     } else {
    //         wrapped = { ...this.object }
    //     }

    //     return new BaseWrapper(wrapped,
    //         this.id,
    //         this.isPlaceholder,
    //         this.simpleConcepts,
    //         this.simplePredicates)
    // }

}