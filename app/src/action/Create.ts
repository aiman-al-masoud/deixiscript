import { Id } from "../clauses/Id";
import { wrap } from "../concepts/Wrapper";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";

export default class Create implements Action {

    constructor(readonly id: Id, readonly predicate: string, ...args: any[]) {

    }

    async run(enviro: Enviro): Promise<any> {

        if(enviro.exists(this.id)){ //  existence check prior to creating
            return 
        }

        if (isDomElem(this.predicate)) {

            const o = document.createElement(this.predicate)
            document.body.appendChild(o)
            o.id = this.id + ''
            o.textContent = 'default'
            const newObj = wrap(o)
            newObj.set(this.predicate)
            enviro.set(this.id, newObj)
            
        }

    }

}

function isDomElem(predicate: string) {

    return ['button'].includes(predicate)

}