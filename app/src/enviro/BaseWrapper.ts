import { Clause, clauseOf, emptyClause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
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

    set(predicate: Lexeme, opts?: SetOps): void {

        if (opts?.negated) {
            this.setNo(predicate, opts)
        } else {
            this.setYes(predicate, opts)
        }

    }

    protected setNo(predicate: Lexeme, opts?: SetOps) {

        if (this.is(predicate)) {
            this.setYes({ ...predicate, root: '' }, { ...opts, negated: false })
        }

    }

    protected setYes(predicate: Lexeme, opts?: SetOps) {

        const props = opts?.props ?? []

        if (this.isPlaceholder) {
            this.setSimplePredicate(predicate)
        } else if (props.length > 1) { // assume > 1 props are a path
            this.setNested(props.map(x => x.root), predicate.root)
        } else if (props.length === 1) {
            this.setSingleProp(predicate, props[0])
        } else if (props.length === 0) {
            this.setZeroProps(predicate)
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

    call(verb: Lexeme, args: Wrapper[]) {
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

    protected setSingleProp(value: Lexeme, prop: Lexeme) {

        const path = this.simpleConcepts[prop.root]?.path

        if (path) { // is concept 
            this.setNested(path, value.root)
        } else { // not concept
            this.setNested([prop.root], value.root)
        }

    }

    protected setZeroProps(predicate: Lexeme) {

        if (predicate.concepts && predicate.concepts.length > 0) {
            this.setNested(this.simpleConcepts[predicate.concepts[0]].path, predicate.root)
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

    // protected clone(): Wrapper {

    //     let objectClone

    //     if (this.object instanceof HTMLElement) {
    //         objectClone = this.object.cloneNode() as HTMLElement
    //         objectClone.innerHTML = this.object.innerHTML
    //     } else {
    //         objectClone = { ...this.object }
    //     }

    //     return new BaseWrapper(objectClone,
    //         this.id,
    //         this.isPlaceholder,
    //         this.simpleConcepts,
    //         this.simplePredicates)
    // }

}