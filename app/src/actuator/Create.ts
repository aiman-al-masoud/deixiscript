import { Id } from "../clauses/Id";
import { wrap } from "../enviro/Wrapper";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";
import { getProto, Lexeme } from "../lexer/Lexeme";

export default class Create implements Action {

    constructor(readonly id: Id, readonly predicate: Lexeme) {

    }

    run(enviro: Enviro): any {

        if (enviro.exists(this.id)) { //  existence check prior to creating
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
            enviro.set(this.id, newObj)
            enviro.root?.appendChild(o)

        } else {

            const o = new (proto as any).constructor()
            const newObj = wrap(o)
            newObj.set(this.predicate)
            enviro.set(this.id, newObj)

        }

    }

}