import Brain from "../brain/Brain";
import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import { getAction } from "./actions/Action";
import { Ed } from "./Ed";

export default interface Actuator {
    onUpdate(clauses: Clause[]): Promise<void> // update from top (Brain)
    pointOut(ids: Id[]): Promise<void>
    onSense(clauses: Clause[]): Promise<void> // update from bottom (Action, Sensor ...)
    readonly ed: Ed
    readonly brain: Brain
}

export function getActuator(brain: Brain): Actuator {
    return new BaseActuator(brain)
}

class BaseActuator implements Actuator {

    constructor(readonly brain: Brain, readonly ed = brain.ed) {

    }

    onUpdate = async (clauses: Clause[]): Promise<void> => {

        clauses.forEach(c => {
            getAction(c, this).run() // out of order execution, with auto-await for id mechanism
        })

    }

    pointOut = async (ids: Id[]): Promise<void> => {

        this.brain.ed.values.forEach(o => {
            o.style ? o.style.outline = '' : 0
        })

        for (const id of ids) {
            const elem = await this.brain.ed.get(id)
            elem && elem.style ? elem.style.outline = '#f00 solid 2px' : 0
        }

    }

    onSense = async (clauses: Clause[]): Promise<void> => {

        clauses.forEach(c => {
            this.brain.assert(c, {fromBelow:true})
        })

    }

}