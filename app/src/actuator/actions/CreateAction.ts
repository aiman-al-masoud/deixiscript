import { getIncrementalId } from "../../id/functions/getIncrementalId";
import { Context } from "../../brain/Context";
import { getProto } from "../../lexer/functions/getProto";
import Action from "./Action";
import { Clause } from "../../clauses/Clause";
import { lookup } from "./getAction";
import { Id } from "../../id/Id";
import { newInstance } from "../../utils/newInstance";

export default class CreateAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const localId = this.clause?.args?.[0] as Id
        const id = lookup(localId, context, this.topLevel) ?? getIncrementalId()
        const predicate = this.clause.predicate

        if (!predicate) {
            return
        }

        if (context.enviro.get(id)?.is(predicate)) {  //  existence check prior to creating
            return
        }

        const proto = getProto(predicate)

        if (!proto) {
            return
        }

        const o = newInstance(proto)
        init(o, context, id)
        context.enviro.set(id, o).set(predicate)

    }

}

function init(o: object, context: Context, id: Id) {

    if (o instanceof HTMLElement) {
        o.id = id + ''
        o.textContent = 'default'
        context?.enviro.root?.appendChild(o)
    }
}