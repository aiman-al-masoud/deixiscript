import { getIncrementalId } from "../../id/functions/getIncrementalId";
import { Context } from "../../brain/Context";
import { getProto } from "../../lexer/functions/getProto";
import Action from "./Action";
import { Clause } from "../../clauses/Clause";
import { lookup } from "./getAction";

export default class CreateAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const id = lookup(this.clause?.args?.[0] as any, context, this.topLevel) ?? getIncrementalId()
        const predicate = this.clause.predicate

        if (!predicate) {
            return
        }

        if (context.enviro.get(id)?.is(predicate)) {  //  existence check prior to creating
            return
        }

        const proto = getProto(predicate)

        if (proto instanceof HTMLElement) {

            const tagNameFromProto = (x: Object) => x.constructor.name.replace('HTML', '').replace('Element', '').toLowerCase()
            const o = document.createElement(tagNameFromProto(proto))
            context.enviro.root?.appendChild(o)
            o.id = id + ''
            o.textContent = 'default'
            context.enviro.set(id, o).set(predicate)

        } else {

            const o = new (proto as any).constructor()
            context.enviro.set(id, o).set(predicate)

        }

    }

}