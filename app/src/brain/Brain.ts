import { Clause, Id } from "../clauses/Clause"
import PrologBrain from "./PrologBrain"

export default interface Brain{
    query(query:Clause):Promise<Id[] | boolean>
    assert(code:Clause):Promise<void>
    // find(query:Clause):Promise<Id[]>
    // check(query:Clause):Promise<boolean>
    // clone():Brain
    // addListener(element:number, event:string, callback:(event:Event)=>void):void
}

export async function getBrain():Promise<Brain>{ // async due to possible init phase (in the future)
    return new PrologBrain()
}