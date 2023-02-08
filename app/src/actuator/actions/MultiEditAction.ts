import { Context } from "../../brain/Context";
import { Clause, clauseOf } from "../../clauses/Clause";
import Action from "./Action";

export default class MultiEditAction implements Action {

    constructor(
        readonly clause: Clause,
        readonly condition = clause.theme,
        readonly conclusion = clause.rheme) {

    }

    run(context: Context) {
        const top = this.condition.topLevel()[0]
        const protoName = this.condition.describe(top)[0] // assume one 
        const predicate = this.conclusion.describe(top)[0]
        const y = context.enviro.query(clauseOf(protoName, 'X'))
        const ids = y.map(m => m['X'])
        ids.forEach(id => context.enviro.get(id)?.set(predicate, { negated: this.conclusion.negated }))
    }

}