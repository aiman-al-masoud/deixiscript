import { Id } from "../../clauses/Id";
import { Context } from "../../brain/Context";
import { wrap } from "../../enviro/Wrapper";
import { Lexeme, getProto } from "../../lexer/Lexeme";
import Action from "./Action";

export default class CreateAction implements Action {

    constructor(readonly id: Id, readonly predicate: Lexeme) {

    }

    run(context: Context): any {

        if (context.enviro.exists(this.id)) { //  existence check prior to creating
            return
        }

        const proto = getProto(this.predicate)

        if (proto instanceof HTMLElement) {

            const tagNameFromProto = (x: Object) => x.constructor.name.replace('HTML', '').replace('Element', '').toLowerCase()
            const o = document.createElement(tagNameFromProto(proto))
            context.enviro.root?.appendChild(o)
            o.id = this.id + ''
            o.textContent = 'default'
            const newObj = wrap(o, context)
            newObj.set(this.predicate)
            context.enviro.set(this.id, newObj)

        } else {

            const o = new (proto as any).constructor()
            const newObj = wrap(o, context)
            newObj.set(this.predicate)
            context.enviro.set(this.id, newObj)

        }

    }

}