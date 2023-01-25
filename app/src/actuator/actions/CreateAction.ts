import { Id } from "../../clauses/Id";
import { Context } from "../../brain/Context";
import { Enviro } from "../../enviro/Enviro";
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
            o.id = this.id + ''
            o.textContent = 'default'
            const newObj = wrap(o)
            newObj.set(this.predicate)
            context.enviro.set(this.id, newObj)
            context.enviro.root?.appendChild(o)

        } else {

            const o = new (proto as any).constructor()
            const newObj = wrap(o)
            newObj.set(this.predicate)
            context.enviro.set(this.id, newObj)

        }

    }

}