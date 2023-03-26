import Action from "./Action";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { Clause } from "../../middle/clauses/Clause";
import { getKool } from "../../middle/clauses/functions/getKool";
import { Context } from "../../facade/context/Context";

export default class SimpleAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (!this.clause.args || !this.clause.predicate) {
            return
        }

        const args =
            this.clause
                .args
                .map(x => getKool(context, this.topLevel.theme, x)[0] ?? context.set({ id: getIncrementalId(), preds: [], type: 1 }))

        const subject = args[0]

        const res = subject?.set(this.clause.predicate, {
            args: args.slice(1),
            context,
            negated: this.clause.negated
        })

        if (res) {
            context.set({ wrapper: res, type: 2 })
        }

        return res
    }

}