import { clauseOf } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import Action from "./Action";

export default class DefaultSetter implements Action {

    constructor(readonly prop: Id, readonly val: string, readonly actuator: Actuator) {

    }

    async run(): Promise<void> {

        if (this.val !== 'blue') { // TODO jsProp === this.val
            return
        }

        const clause = clauseOf('of', this.prop, 'X').copy({ noAnaphora: true })
        const owners = await this.actuator.brain.query(clause)

        const owner = owners.filter(o => Object.values(o).length <= 2)[0]?.X
        // console.log('OWNERID', owner)

        const ownerObject = await this.actuator.ed.get(owner)

        // console.log('OWNER', 'OWNER', ownerObject.object)

        const jsProp = 'background'

        // console.log(ownerObject.object, '.', jsProp, '=', this.val, { owner })

        if (this.val && jsProp && ownerObject) {
            ownerObject.object[jsProp] = this.val
        }

    }

}