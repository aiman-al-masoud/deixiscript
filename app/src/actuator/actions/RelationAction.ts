import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import Action from "./Action";
import { lookup } from "./getAction";

export default class RelationAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const args = (this.clause.args ?? [])
            .map(a => lookup(a, context, this.topLevel))

        const predicate = this.clause.predicate

        if (!args || !predicate) {
            return
        }

        const subject = context.enviro.get(args[0])
        const object = context.enviro.get(args[1])

        return subject?.set(predicate, { args: object ? [object] : [] })
    }

}