import { getConcepts } from "./getConcepts";
import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly o: any) {

    }

    set(predicate: string, props?: string[]): void {

        (this.o as any)[predicate] = true // TODO: remove

        if (props && props.length > 1) { // set the pedicate on the path

            let x = this.o[props[0]]

            props.slice(1, -2).forEach(p => {
                x = this.o[p]
            });

            x[props[props.length - 1]] = predicate

            return
        }

        //1 if len(props) == 1 use it as a concept (TODO or at least check if concept agrees with predicate)
        //2 if len(props) == 0 get the concept from the predicate (eg: red is a 'color')

        const concepts = getConcepts(predicate)

        if (this.o instanceof HTMLElement && concepts[0] === 'color') {
            this.o.style.background = predicate
        }

    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return (this.o as any)[predicate] !== undefined // TODO: remove
    }


}