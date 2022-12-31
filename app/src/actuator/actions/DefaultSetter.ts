import { clauseOf } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";
import Actuator from "../Actuator";
import { Ed } from "../Ed";
import Action from "./Action";

export default class DefaultSetter implements Action {

    constructor(readonly prop: Id, readonly val: string, readonly actuator: Actuator) {

    }

    async run(): Promise<void> {

        // if(jsProp === this.val){
        //     return 
        // }

        if (this.val !== 'blue') {
            return
        }

        console.log('start DefaultSetter')
        let jsProp = await this.actuator.ed.getJsName(this.prop)

        const clause = clauseOf('of', this.prop, 'X')
        const owners = await this.actuator.brain.query(clause, { noAnaphora: true })

        const owner: Id = (owners[0] ?? {}).X
        const ownerObject = await this.actuator.ed.get(owner)

        console.log(ownerObject, '.', jsProp, '=', this.val, { owner })

        if (this.val && jsProp && ownerObject) {
            ownerObject[jsProp] = this.val
        }

    }

}