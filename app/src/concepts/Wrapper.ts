import { Clause } from "../clauses/Clause"
import { Id } from "../clauses/Id"
import ConcreteWrapper from "./ConcreteWrapper"

export default interface Wrapper {

    set(predicate: string, props?: string[]): void // obj.set('red'), obj.set('on', obj2) ...
    is(predicate: string, ...args: Wrapper[]): boolean
    setAlias(conceptName: string, propPath: string[]): void
    // get(predicate: string): any
    // getProp(path: string[]): any
    // setProp(path: string[], value: any): void
    // describe(): string[] // ['button', 'red', 'big', ...]
    // setAlias(name: string, path: string[]): void // .setAlias('width', ['style', 'width'])
    // addConcept(concept:string, setter:()=>void, is:()=>):void
    // doSomething(clause:Clause):any // get ownership chain and do something with the clause, clause has everything, it has info on side-effects, predicate etc...???

}


export function wrap(o: any) {
    return new ConcreteWrapper(o)
}