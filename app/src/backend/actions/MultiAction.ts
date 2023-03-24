import { Context } from "../../facade/context/Context";
import { Clause } from "../../middle/clauses/Clause";
import Action from "./Action";
import { getAction } from "./getAction";

export default class MultiAction implements Action {

    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        context.query(this.clause.theme).forEach(m => {

            const top = this.clause.copy({ map: m, exactIds: true })
            const conseq = top.rheme
            const clauses = conseq.flatList()
            const actions = clauses.map(c => getAction(c, top))
            actions.forEach(a => a.run(context))

        })

    }

}