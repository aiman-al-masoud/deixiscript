import { Context } from "../../brain/Context";
import { Clause, clauseOf } from "../../clauses/Clause";
import Action from "./Action";

export default class MultiEditAction implements Action {

    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const condition = this.clause.theme
        const consequence = this.clause.rheme

        const top = condition.topLevel()[0]
        const protoName = condition.describe(top)[0] // assume one 
        const predicate = consequence.describe(top)[0]
        const y = context.enviro.query(clauseOf(protoName, 'X'))
        const ids = y.map(m => m['X'])
        ids.forEach(id => context.enviro.get(id)?.set(predicate, { negated: consequence.negated }))
    }

}