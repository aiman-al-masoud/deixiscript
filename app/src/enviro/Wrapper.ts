import ConcreteWrapper from "./ConcreteWrapper"

export default interface Wrapper {

    readonly object: any
    set(predicate: string, props?: string[]): void
    is(predicate: string, ...args: Wrapper[]): boolean
    setAlias(conceptName: string, propPath: string[]): void
    pointOut(opts?: { turnOff: boolean }): void
    // get(predicate: string): any

}

export function wrap(o: any) {
    return new ConcreteWrapper(o)
}