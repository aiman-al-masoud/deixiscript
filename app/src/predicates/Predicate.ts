export default interface Predicate{
    verb:string 
    method:string
    classes:string[]
    parameters:{// verb preposition arg to method param
        string:string
    }
    apply(object:any, ...args:any[]):any
}

