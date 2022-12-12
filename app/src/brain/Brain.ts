export default interface Brain{
    find(query:string):any[]
    check(query:string):boolean
    assume(code:string):void
    clone():Brain
    addListener(element:Element, event:string, callback:(event:Event)=>{}):void
}