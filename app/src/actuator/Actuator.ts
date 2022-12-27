import Brain from "../brain/Brain";
import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import { getAction } from "./actions/Action";
import { Ed } from "./Ed";

export default interface Actuator {
    onUpdate(clauses: Clause[]): Promise<void>
    pointOut(ids: Id[]): Promise<void>
    onSense(clauses: Clause[]): Promise<void>
    readonly ed: Ed
}

export function getActuator(brain: Brain): Actuator {
    return new BaseActuator(brain)
}

class BaseActuator implements Actuator {

    constructor(readonly brain: Brain, readonly ed = brain.ed) {

    }

    onUpdate = async (clauses: Clause[]): Promise<void> => {

        clauses.forEach(c => {
            getAction(c, this.brain.ed, this).run()
        })

    }

    pointOut = async (ids: Id[]): Promise<void> => {

        this.brain.ed.values.forEach(o => {
            o.style.outline = ''
        })

        ids.forEach(id => {
            const elem = this.brain.ed.get(id)
            elem ? elem.style.outline = '#f00 solid 2px' : 0
        })

    }

    onSense = async (clauses: Clause[]): Promise<void> => {

        for (const c of clauses) {
            this.brain.assert(c)
        }

    }

}