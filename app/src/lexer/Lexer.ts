import Token from "../ast/interfaces/Token"

export default interface Lexer{
    next():void
    backTo(pos:number):void
    peek():Token
    croak(errorMsg:string):void   
}