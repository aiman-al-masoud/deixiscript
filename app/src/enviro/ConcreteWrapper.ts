import { getConcepts } from "./getConcepts";
import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly object: any,
        readonly simpleConcepts: { [conceptName: string]: string[] } =  object.simpleConcepts ?? {}  ) {

        this.setAlias('color', ['style', 'background']);
        this.setAlias('width', ['style', 'width']);

        object.simpleConcepts = simpleConcepts
        //TODO do this only once and only for HTMLElement's prototype
        //TODO put it ON the prototype object so it can be retrieved as "this.o.simpleConcepts" from any instance of the prototype
    }


    set(predicate: string, props?: string[]): void {

        (this.object as any)[predicate] = true // TODO: remove

        if (props && props.length > 1) { // set the pedicate on the path
            this.setNested(props, predicate)
            return
        }

        //1 if len(props) == 1 use it as a concept
        if (props && props.length === 1) {

            if (Object.keys(this.simpleConcepts).includes(props[0])) { // is concept
                this.setNested(this.simpleConcepts[props[0]], predicate)
            } else {
                this.setNested(props, predicate)
            }

            return
        }

        //2 if len(props) == 0 get the concept from the predicate (eg: red is a 'color')
        const concepts = getConcepts(predicate)

        if (concepts.length === 0) {
            return
        }

        this.setNested(this.simpleConcepts[concepts[0]], predicate)

    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return (this.object as any)[predicate] !== undefined // TODO: remove
    }

    setAlias(conceptName: string, propPath: string[]): void {
        this.simpleConcepts[conceptName] = propPath
    }

    protected setNested(path: string[], value: string) {

        let x = this.object[path[0]]

        path.slice(1, -2).forEach(p => {
            x = this.object[p]
        });

        x[path[path.length - 1]] = value

    }

    pointOut(opts?: { turnOff: boolean; }): void {

        if (this.object instanceof HTMLElement) {
            this.object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
        }

    }

}