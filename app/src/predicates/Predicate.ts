import { ActionArgs } from "../actuator/Actuator";

export default interface Predicate{
    apply(args:ActionArgs):any
}

export interface MethodPredicate extends Predicate{
    methodPath:string[]
    paramsMap:ParamsMap
}

export interface AttributePredicate extends Predicate{
    aliases:string[]
    propPath:string[]
    valuesMap:ValuesMap
}

/**
 * Maps a verb's params to a method's params
 */
export interface ParamsMap{ // 0-> object, 1-> first method param, 2-> second method param ... 
    subject:number
    object?:number
    on?:number
    with?:number
    for?:number
    by?:number
    to?:number
}

export interface ValuesMap{
    string:any
}