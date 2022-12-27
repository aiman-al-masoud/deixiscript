import Brain from "../brain/Brain";
import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import { getAction } from "./Action";

export default interface Actuator {
    update(clauses: Clause[]): Promise<void>
    pointOut(ids: Id[]): Promise<void>
}

export function getActuator(brain: Brain): Actuator {
    return new BaseActuator(brain)
}

class BaseActuator implements Actuator {

    constructor(readonly brain: Brain) {

    }

    async update(clauses: Clause[]): Promise<void> {

        clauses.forEach(c => {
            getAction(c, this.brain.ed).run()
        })

    }

    async pointOut(ids: Id[]): Promise<void> {

        this.brain.ed.values.forEach(o => {
            o.style.outline = ''
        })

        ids.forEach(id => {
            const elem = this.brain.ed.get(id)
            elem ? elem.style.outline = '#f00 solid 2px' : 0
        })

    }

}