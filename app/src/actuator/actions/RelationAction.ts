import Action from "./Action";
import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import { getKool } from "../../clauses/functions/getKool";
import { getIncrementalId } from "../../id/functions/getIncrementalId";

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
            context.enviro.set(getIncrementalId(), res)
        }

        return res
    }

}