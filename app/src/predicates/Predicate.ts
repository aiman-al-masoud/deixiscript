import { ActionArgs, ObjArgs } from "../actuator/Actuator";

export default interface Predicate{
    apply(args:ObjArgs):any
}

// export interface MethodPredicate extends Predicate{
//     methodPath:string[]
//     paramsMap:ParamsMap
// }

// /**
//  * Maps a verb's params to a method's params
//  */
// export interface ParamsMap{ // 0-> object, 1-> first method param, 2-> second method param ... 
//     subject:number
//     object?:number
//     on?:number
//     with?:number
//     for?:number
//     by?:number
//     to?:number
// }
