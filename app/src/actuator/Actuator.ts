import Brain from "../brain/Brain";
import { Clause } from "../clauses/Clause";

export default interface Actuator {
    update(clauses: Clause[]): Promise<void>
}

export function getActuator(brain:Brain):Actuator{
    throw new Error('not implemented')
}