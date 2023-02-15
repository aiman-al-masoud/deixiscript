import { getIncrementalId } from "../../id/functions/getIncrementalId";
import { Context } from "../../brain/Context";
import Action from "./Action";
import { Clause } from "../../clauses/Clause";
import { getKool } from "../../clauses/functions/getKool";

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

        const wrapper = getKool(context, searchSpace, localId)[0] ?? context.enviro.set(getIncrementalId())
        wrapper?.set(predicate, { negated: this.clause.negated })

    }

}