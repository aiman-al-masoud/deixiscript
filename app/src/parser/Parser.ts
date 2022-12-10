import Ast from "../ast/interfaces/Ast";
import BasicParser from "./BasicParser";

export default interface Parser{
    parse():Ast   
}

export function getParser(sourceCode:string){
    return new BasicParser(sourceCode)
}