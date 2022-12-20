import { Id } from "../clauses/Clause"

export default interface Brain{
    find(query:string):Promise<Id[]>
    check(query:string):Promise<boolean>
    assume(code:string):Promise<void>
    
    // clone():Brain
    // addListener(element:number, event:string, callback:(event:Event)=>void):void
}