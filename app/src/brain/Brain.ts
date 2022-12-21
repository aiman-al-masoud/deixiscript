import { Clause, Id } from "../clauses/Clause"

export default interface Brain{
    // find(query:Clause):Promise<Id[]>
    // check(query:Clause):Promise<boolean>
    query(query:Clause):Promise<Id[] | boolean>
    assert(code:Clause):Promise<void>
    
    // clone():Brain
    // addListener(element:number, event:string, callback:(event:Event)=>void):void
}