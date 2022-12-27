import Brain from "../brain/Brain";
import { Clause } from "../clauses/Clause";
import { getAction } from "./Action";

export default interface Actuator {
    update(clauses: Clause[]): Promise<void>
}

export function getActuator(brain:Brain):Actuator{
    return new BaseActuator(brain)
}

class BaseActuator implements Actuator{

    constructor(readonly brain : Brain){

    }

    async update(clauses: Clause[]): Promise<void> {

        clauses.forEach(c=>{
            getAction(c, this.brain.ed).run()
        })

    }

}