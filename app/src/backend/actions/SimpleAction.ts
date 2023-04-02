import Action from "./Action";
import { Clause } from "../../middle/clauses/Clause";
// import { getKool } from "../../middle/clauses/functions/getKool";
import { Context } from "../../facade/context/Context";
import { wrap } from "../wrapper/Wrapper";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";

export default class SimpleAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (!this.clause.args || !this.clause.predicate) {
            return
        }

        const maps = context.query(this.topLevel.theme)

        const map = maps[0] ?? {}

        const args = this.clause.args
            .map(id => map[id] ? context.get(map[id])! : context.set(wrap({ id: getIncrementalId() })))

        const subject = args[0]

        const res = subject?.set(this.clause.predicate, {
            args: args.slice(1),
            context,
            negated: this.clause.negated
        })

        if (!this.clause.predicate.referent && this.clause.predicate.type === 'noun') { // referent of "proper noun" is first to get it 
            this.clause.predicate.referent ??= subject
            context.setLexeme(this.clause.predicate)
        }

        // if (res) {
        //     context.set({ wrapper: res, type: 2 })
        // }

        return res
    }

}