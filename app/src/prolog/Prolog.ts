export default interface Prolog{
    assert(clause:string, opts?:AssertOpts):void 
    retract(clause:string):void  
    query(code:string):boolean|any[]
    predicates(opts?:PreidcatesOpts):string[]
}

export interface AssertOpts{
    /** if true calls assertz */
    z:boolean 
}

export interface PreidcatesOpts{
    arity:number
}