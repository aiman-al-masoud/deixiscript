import Predicate from "../predicates/Predicate";

/**
 * Predicate Resultion Table
 */
export default interface Prt{
    get(verbOrAdj:string, object:any):Predicate
    getIncompatible(verb:string, object:any):Predicate[]
}