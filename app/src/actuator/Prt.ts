import { Constructor } from "../lexer/Lexer";
import Predicate from "../predicates/Predicate";

/**
 * Predicate Resultion Table
 */
export default interface Prt{
    get(verb:string, object:any):Predicate
}