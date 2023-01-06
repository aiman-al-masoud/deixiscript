import { Clause } from "../clauses/Clause"
import { Id } from "../clauses/Id"

export default interface Wrapper {

    set(predicate: string, ...args: Wrapper[]): void // obj.set('red'), obj.set('on', obj2) ...
    is(predicate: string, ...args: Wrapper[]): boolean
    get(predicate: string): any
    getProp(path: string[]): any
    setProp(path: string[], value: any): void
    isAll(): string[] // ['button', 'red', 'big', ...]
    setAlias(name: string, path: string[]): void // .setAlias('width', ['style', 'width'])
    // addConcept(concept:string, setter:()=>void, is:()=>):void
    // doSomething(clause:Clause):any // get ownership chain and do something with the clause, clause has everything, it has info on side-effects, predicate etc...???

}