import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import Action from "./Action";
import { getAction } from "./getAction";

export default class MultiAction implements Action {

    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const condition = this.clause.theme

        context.enviro.query(condition).forEach(m => {

            const top = this.clause.copy({ map: m, exactIds: true })
            const conseq = top.rheme
            const clauses = conseq.flatList()
            const actions = clauses.map(c => getAction(c, top))
            actions.forEach(a => a.run(context))

        })

    }

}