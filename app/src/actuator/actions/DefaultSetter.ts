import { clauseOf } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import Action from "./Action";

export default class DefaultSetter implements Action {

    /**
     * 
     * @param prop id of an attribute-representing-entity
     * @param val value to be assigned to the attribute
     * @param actuator 
     */
    constructor(readonly prop: Id, readonly val: string, readonly actuator: Actuator) {

    }

    async run(): Promise<void> {

        const jsProp = (await this.actuator.ed.get(this.prop)).jsName

        if (!jsProp || jsProp === this.val) {
            return
        }

        const clause = clauseOf('of', this.prop, 'X').copy({ noAnaphora: true })
        const owners = await this.actuator.brain.query(clause)

        if (!owners) {
            return
        }

        const owner = owners.filter(o => Object.values(o).length <= 2)[0]?.X
        const ownerObject = await this.actuator.ed.get(owner)

        // console.log(ownerObject.object, '.', jsProp, '=', this.val, { owner })
        ownerObject.object[jsProp] = this.val
    }

}