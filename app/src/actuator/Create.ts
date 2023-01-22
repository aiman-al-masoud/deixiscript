import { Id } from "../clauses/Id";
import { wrap } from "../enviro/Wrapper";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";
import { Lexeme } from "../lexer/Lexeme";
import { LexemeType } from "../config/LexemeType";

export default class Create implements Action {

    constructor(readonly id: Id, readonly predicate: Lexeme<LexemeType>) {

    }

    run(enviro: Enviro): any {

        if (enviro.exists(this.id)) { //  existence check prior to creating
            return
        }

        if (isDomElem(this.predicate.root)) {

            const o = document.createElement(this.predicate.root)
            o.id = this.id + ''
            o.textContent = 'default'
            const newObj = wrap(o)
            newObj.set(this.predicate)
            enviro.set(this.id, newObj)
            enviro.root?.appendChild(o)

        }

    }

}

function isDomElem(predicate: string) {
    return ['button'].includes(predicate)
}