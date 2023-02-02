import { Id } from "../clauses/Id";
import { Lexeme } from "../lexer/Lexeme";
import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(
        readonly object: any,
        readonly id: Id,
        readonly simpleConcepts: { [conceptName: string]: { path: string[], lexeme: Lexeme } } = object.simpleConcepts ?? {},
        readonly simplePredicates: Lexeme[] = []) {

        object.simpleConcepts = simpleConcepts
        object.simplePredicates = simplePredicates
    }

    set(predicate: Lexeme, props?: Lexeme[]): void {

        if (props && props.length > 1) { // assume > 1 props are a path
            this.setNested(props.map(x => x.root), predicate.root)
        } else if (props && props.length === 1) {
            this.setSingleProp(predicate, props)
        } else if (!props || props.length === 0) {
            this.setZeroProps(predicate)
        }

    }

    is(predicate: Lexeme): boolean {

        const concept = predicate.concepts?.at(0)

        return concept ?
            this.getNested(this.simpleConcepts[concept].path) === predicate.root :
            this.simplePredicates.map(x => x.root).includes(predicate.root)

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

    protected setSingleProp(predicate: Lexeme, props: Lexeme[]) {

        const path = this.simpleConcepts[props[0].root].path

        if (path) { // is concept 
            this.setNested(path, predicate.root)
        } else { // not concept
            this.setNested(props.map(x => x.root), predicate.root)
        }

    }

    protected setZeroProps(predicate: Lexeme) {

        if (predicate.concepts && predicate.concepts.length > 0) {
            this.setNested(this.simpleConcepts[predicate.concepts[0]].path, predicate.root)
        } else {
            this.simplePredicates.push(predicate) //TODO: check duplicates!
        }

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

}