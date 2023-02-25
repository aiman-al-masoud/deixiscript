import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import Action from "./Action";
import { Clause } from "../../middle/clauses/Clause";
import { getKool } from "../../middle/clauses/functions/getKool";
import { Context } from "../../facade/context/Context";

export default class EditAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const localId = this.clause.args?.[0]
        const predicate = this.clause.predicate
        const searchSpace = this.topLevel.theme

        if (!localId || !predicate) {
            return
        }

        const wrapper = getKool(context, searchSpace, localId)[0] ?? context.set(getIncrementalId())
        wrapper?.set(predicate, { negated: this.clause.negated })

    }

}