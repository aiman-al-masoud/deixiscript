import Predicate from "../predicates/Predicate";

export default interface Actuator{
    onStateChange(predicates:Predicate[]):void
}