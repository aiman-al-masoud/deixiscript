export default interface Brain{
    find(query:string):number[]
    check(query:string):boolean
    assume(code:string):void
    clone():Brain
    addListener(element:number, event:string, callback:(event:Event)=>void):void
}