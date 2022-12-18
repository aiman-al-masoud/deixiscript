import { Id } from "../clauses/Clause"

export default interface Brain{
    find(query:string):Id[]
    check(query:string):boolean
    assume(code:string):void
    
    // clone():Brain
    // addListener(element:number, event:string, callback:(event:Event)=>void):void
}