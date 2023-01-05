export default interface Wrapper {

    set(predicate: string, ...args: Wrapper[]): void // obj.set('red'), obj.set('on', obj2) ...
    is(predicate: string, ...args: Wrapper[]): boolean
    get(predicate: string): any
    getProp(path: string[]): any
    setProp(path: string[], value: any): void
    isAll(): string[] // ['button', 'red', 'big', ...]
    // addConcept(concept:string, setter:()=>void, is:()=>):void

}