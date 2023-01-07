import Wrapper from "./Wrapper";

export default class ConcreteWrapper implements Wrapper {

    constructor(readonly o: any) {

    }

    set(predicate: string, ...args: Wrapper[]): void {
        (this.o as any)[predicate] = true

        if (this.o instanceof HTMLElement) { //TODO: use polymorphism
            this.o.style.background = predicate
        }

    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return (this.o as any)[predicate] !== undefined
    }


}