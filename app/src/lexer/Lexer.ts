import Token from "../ast/interfaces/Token"
import EagerLexer from "./EagerLexer"

export default interface Lexer{
    next():void
    backTo(pos:number):void
    get peek():Token
    get pos():number
    croak(errorMsg:string):void   
}

export function getLexer(sourceCode:string){
    return new EagerLexer(sourceCode)
}