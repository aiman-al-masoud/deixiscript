import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly o: any) {

    }

    set(predicate: string, props?: string[]): void {

        (this.o as any)[predicate] = true

        if(props){
            console.log('props', {props})
        }

        if (this.o instanceof HTMLElement) { //TODO: use polymorphism
            this.o.style.background = predicate
        }

    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return (this.o as any)[predicate] !== undefined
    }


}