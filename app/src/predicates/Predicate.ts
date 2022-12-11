export default interface Predicate{
    verb:string 
    method:string
    classes:string[]
    parameters:{// verb arguments (including subject, object and complements) mapped to method param
        string:string
    }
    apply(object:any, ...args:any[]):any
}

