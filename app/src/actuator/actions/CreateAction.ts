import { getIncrementalId } from "../../id/functions/getIncrementalId";
import { Context } from "../../brain/Context";
import { getProto } from "../../lexer/functions/getProto";
import Action from "./Action";
import { Clause } from "../../clauses/Clause";
import { lookup } from "./getAction";
import { Id } from "../../id/Id";
import { tagNameFromProto } from "../../utils/tagNameFromProto";

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

        const o = newInstance(getProto(predicate), context, id)
        context.enviro.set(id, o).set(predicate)

    }

}

function newInstance(proto?: object, context?: Context, id?: Id) {

    if (proto instanceof HTMLElement) {
        const o = document.createElement(tagNameFromProto(proto))
        o.id = id + ''
        o.textContent = 'default'
        context?.enviro.root?.appendChild(o)
        return o
    } else {
        return new (proto as any).constructor()
    }

}

