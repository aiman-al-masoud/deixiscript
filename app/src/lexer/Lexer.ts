import Token from "../ast/interfaces/Token"
import EagerLexer from "./EagerLexer"

export default interface Lexer{
    next():void
    backTo(pos:number):void
    get peek():Token
    get pos():number
    croak(errorMsg:string):void   
    assert<T extends Token>(args:AssertArgs): T|undefined 
}

export interface AssertArgs{
    errorMsg?:string
    errorOut?:boolean
}

export function getLexer(sourceCode:string){
    return new EagerLexer(sourceCode)
}