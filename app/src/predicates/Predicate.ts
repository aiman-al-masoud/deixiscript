export default interface Predicate{
    verb:string 
    method:string
    classes:string[]
    paramsMap:ParamsMap
    apply(args:Args):any
}

export interface Args{
    subject:any
    object?:any
    on?:any
    with?:any
    for?:any
    by?:any
    string:any
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
    string:number
}


export interface PredicateB{
    name:string // eg: color
    propMap:PropMap // eg: yellow -> 'yellow'
    classes:string[]
    property:string[] // if used directly on object, without mentioning name, nested properties, eg: ['style', 'background']
}

export interface PropMap{
    string:any
}
