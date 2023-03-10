import Action from "./Action";
import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { Id } from "../../middle/id/Id";
import { newInstance } from "../../utils/newInstance";
import { Clause } from "../../middle/clauses/Clause";
import { Context } from "../../facade/context/Context";

export default class CreateAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const localId = this.clause?.args?.[0] as Id
        const id = context.query(this.topLevel.theme)?.[0]?.[localId] ?? getIncrementalId()
        const predicate = this.clause.predicate

        if (!predicate) {
            return
        }

        if (context.get(id)?.is(predicate)) {  //  existence check prior to creating
            return
        }

        const proto = predicate.getProto()

        if (!proto) {
            return
        }

        const o = newInstance(proto, predicate.root)
        init(o, context, id)

        const numberLexeme = context.lexemes.filter(x => x.root === 'number')[0]
        const predicates = [predicate, ...(typeof o === 'number' ? [numberLexeme] : [])]

        context.set(id, predicates, o)
    }

}

function init(o: object, context: Context, id: Id) {

    if (o instanceof HTMLElement) {
        o.id = id + ''
        o.textContent = 'default'
        context.root?.appendChild(o)
    }
}