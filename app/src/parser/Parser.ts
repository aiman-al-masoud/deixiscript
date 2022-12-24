import Ast from "../ast/interfaces/Ast";
import Constituent from "../ast/interfaces/Constituent";
import BasicParser from "./BasicParser";

export default interface Parser{
    parse():Constituent   
}

export function getParser(sourceCode:string):Parser{
    return new BasicParser(sourceCode)
}