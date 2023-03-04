import Action from "./Action";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { Clause } from "../../middle/clauses/Clause";
import { getKool } from "../../middle/clauses/functions/getKool";
import { Context } from "../../facade/context/Context";

export default class RelationAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const args = (this.clause.args ?? [])
            .map(x => getKool(context, this.topLevel.theme, x)[0])

        if (!this.clause.predicate) {
            return
        }

        const subject = args[0]
        const object = args[1]

        const res = subject?.set(this.clause.predicate, { args: object ? [object] : [] })

        if (res) {
            context.set(getIncrementalId(), [], res)
        }

        return res
    }

}