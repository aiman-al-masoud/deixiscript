import Predicate from "./Predicate";

export default interface Vtable{
    get(verb:string, object:any):Predicate
}