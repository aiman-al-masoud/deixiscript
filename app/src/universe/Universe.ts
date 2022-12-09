export default interface Universe{
    find(query:string):any[]
    check(query:string):boolean
    assume(code:string):void
    clone():Universe
}