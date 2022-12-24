import Token from "../ast/interfaces/Token"
import EagerLexer from "./EagerLexer"

export default interface Lexer{
    next():void
    backTo(pos:number):void
    get peek():Token
    get pos():number
    croak(errorMsg:string):void   
    assert <T>(clazz:Constructor<T>, args:AssertArgs): T|undefined 
}

export interface AssertArgs{
    errorMsg?:string
    errorOut?:boolean
}

export function getLexer(sourceCode:string):Lexer{
    return new EagerLexer(sourceCode)
}

export type Constructor<T> = new (...args: any[]) => T
