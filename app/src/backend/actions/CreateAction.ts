import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { getProto } from "../../frontend/lexer/functions/getProto";
import Action from "./Action";
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

        const proto = getProto(predicate)

        if (!proto) {
            return
        }

        const o = newInstance(proto, predicate.root)
        init(o, context, id)
        context.set(id, o).set(predicate)

    }

}

function init(o: object, context: Context, id: Id) {

    if (o instanceof HTMLElement) {
        o.id = id + ''
        o.textContent = 'default'
        // context?.enviro.root?.appendChild(o)
        context.root?.appendChild(o)
    }
}