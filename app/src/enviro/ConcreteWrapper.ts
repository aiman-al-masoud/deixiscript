import { LexemeType } from "../config/LexemeType";
import { Lexeme } from "../lexer/Lexeme";
import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly object: any,
        readonly simpleConcepts: { [conceptName: string]: string[] } = object.simpleConcepts ?? {}) {

        object.simpleConcepts = simpleConcepts
    }

    set(predicate: Lexeme<LexemeType>, props?: Lexeme<LexemeType>[]): void {

        if (props && props.length > 1) { // assume > 1 props are a path

            this.setNested(props.map(x => x.token ?? x.root), predicate.root)

        } else if (props && props.length === 1) { // single prop

            if (Object.keys(this.simpleConcepts).includes(props[0].root)) { // is concept 
                this.setNested(this.simpleConcepts[props[0].root], predicate.root)
            } else { // ... not concept, just prop
                this.setNested(props.map(x => x.token ?? x.root), predicate.root)
            }

        } else if (!props || props.length === 0) { // no props

            if (predicate.concepts && predicate.concepts.length > 0) {
                this.setNested(this.simpleConcepts[predicate.concepts[0]], predicate.root)
            } else {
                (this.object as any)[predicate.root] = true // fallback
            }

        }

    }

    is(predicate: Lexeme<LexemeType>): boolean {

        const concept = predicate.concepts?.at(0)

        return concept ?
            this.getNested(this.simpleConcepts[concept]) === predicate.root :
            (this.object as any)[predicate.root] !== undefined

    }

    setAlias(conceptName: Lexeme<LexemeType>, propPath: Lexeme<LexemeType>[]): void {
        this.simpleConcepts[conceptName.root] = propPath.map(x => x.root)
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

    pointOut(opts?: { turnOff: boolean; }): void {

        if (this.object instanceof HTMLElement) {
            this.object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
        }

    }

}