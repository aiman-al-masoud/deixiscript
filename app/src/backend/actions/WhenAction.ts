import { Context } from "../../facade/context/Context";
import { Clause } from "../../middle/clauses/Clause";
import Action from "./Action";
import { getAction } from "./getAction";

export default class WhenAction implements Action {

    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const interval = setInterval(() => {

            if (context.query(this.clause.theme).length > 0) {

                this.clause.rheme.flatList().forEach(c => {
                    getAction(c, this.clause.rheme).run(context)
                })

                clearInterval(interval)
            }

        }, 100)

    }

}