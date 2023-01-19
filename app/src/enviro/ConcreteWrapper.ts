import { getConcepts } from "./getConcepts";
import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly object: any,
        readonly simpleConcepts: { [conceptName: string]: string[] } = object.simpleConcepts ?? {}) {

        object.simpleConcepts = simpleConcepts
    }

    set(predicate: string, props?: string[]): void {

        if (props && props.length > 1) { // assume > 1 props are a path

            this.setNested(props, predicate)

        } else if (props && props.length === 1) { // single prop

            if (Object.keys(this.simpleConcepts).includes(props[0])) { // is concept 
                this.setNested(this.simpleConcepts[props[0]], predicate)
            } else { // ... not concept, just prop
                this.setNested(props, predicate)
            }

        } else if (!props || props.length === 0) { // no props

            const concepts = getConcepts(predicate)

            if (concepts.length === 0) {
                (this.object as any)[predicate] = true
            } else {
                this.setNested(this.simpleConcepts[concepts[0]], predicate)
            }
        }

    }

    is(predicate: string, ...args: Wrapper[]): boolean {

        const concept = getConcepts(predicate).at(0)

        return concept ?
            this.getNested(this.simpleConcepts[concept]) === predicate :
            (this.object as any)[predicate] !== undefined

    }

    setAlias(conceptName: string, propPath: string[]): void {
        this.simpleConcepts[conceptName] = propPath
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