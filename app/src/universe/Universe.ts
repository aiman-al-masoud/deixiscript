import Brain from "./Brain"

/**
 * Acts as a gateway to the actual brain
 */
export default interface Universe extends Brain{
    find(query:string):any[]
    check(query:string):boolean
    assume(code:string):void
    clone():Universe
    addListener(object:Element, event:string, handler:(event:Event)=>{}):void
}