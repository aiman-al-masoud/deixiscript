import Predicate from "../predicates/Predicate";

export default interface Actuator{
    onStateChanged(predicates:Predicate[]):void
}