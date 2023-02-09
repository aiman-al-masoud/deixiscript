import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import Action from "./Action";

export default class MultiEditAction implements Action {

    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const condition = this.clause.theme
        const consequence = this.clause.rheme

        context.enviro.query(condition).forEach(m => {

            Object.keys(m).forEach(e => {

                consequence.describe(e).forEach(p => {
                    context.enviro.get(m[e])?.set(p, { negated: consequence.negated })
                })

            })

        })

    }

}