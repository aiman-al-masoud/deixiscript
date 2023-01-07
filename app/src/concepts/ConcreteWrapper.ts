import { getConcepts } from "./getConcepts";
import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly o: any,
        readonly simpleConcepts: { [conceptName: string]: string[] } = {}) {
        this.setAlias('color', ['style', 'background']) // do this only once and only for HTMLElement's prototype
    }

    set(predicate: string, props?: string[]): void {

        (this.o as any)[predicate] = true // TODO: remove

        if (props && props.length > 1) { // set the pedicate on the path
            this.setNested(props, predicate)
            return
        }

        //1 if len(props) == 1 use it as a concept (TODO or at least check if concept agrees with predicate)
        //2 if len(props) == 0 get the concept from the predicate (eg: red is a 'color')

        const concepts = getConcepts(predicate)

        if (concepts.length === 0) {
            return
        }

        this.setNested(this.simpleConcepts[concepts[0]], predicate)

    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return (this.o as any)[predicate] !== undefined // TODO: remove
    }

    setAlias(conceptName: string, propOrSynonConcept: string[]): void {
        this.simpleConcepts[conceptName] = propOrSynonConcept
    }

    protected setNested(path: string[], value: string) {

        let x = this.o[path[0]]

        path.slice(1, -2).forEach(p => {
            x = this.o[p]
        });

        x[path[path.length - 1]] = value

    }

}