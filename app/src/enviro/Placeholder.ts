import Wrapper from "./Wrapper";

export class Placeholder implements Wrapper {

    constructor(readonly predicates: string[] = []) {
    }

    set(predicate: string, props: string[]): void {
        console.log({ props });
        this.predicates.push(predicate);
    }

    is(predicate: string, ...args: Wrapper[]): boolean {
        return this.predicates.includes(predicate);
    }

    setAlias(conceptName: string, propOrSynonConcept: string | string[]): void {
    }
}
