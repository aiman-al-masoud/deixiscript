import { BasicClause } from "../clauses/BasicClause";
import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import { Ed } from "./Ed";

export default interface Action {
    run(): Promise<void>
}

export function getAction(clause: Clause, ed: Ed): Action {

    if (clause instanceof BasicClause) { // TODO: DON'T EXPOSE CLASS!!

        switch (clause.predicate) {

            case 'button':
                return new MakeButton(clause.args[0], ed)

            case 'red':
                return new ChangeColor(clause.args[0], 'red', ed)

            case 'green':
                return new ChangeColor(clause.args[0], 'green', ed)

        }

    }

    return new NoOp(clause)

}


class MakeButton implements Action {

    constructor(readonly id: Id, readonly ed: Ed) {

    }

    async run(): Promise<void> {

        if (!this.ed.get(this.id)) {
            const button = document.createElement('button')
            button.innerText = 'button'
            document.body.appendChild(button)
            this.ed.set(this.id, button)
        }

    }

}

class ChangeColor implements Action {

    constructor(readonly id: Id, readonly color: string, readonly ed: Ed) {

    }

    async run(): Promise<void> {

        const object: HTMLElement = this.ed.get(this.id)
        object.style.background = this.color

    }

}


class NoOp implements Action {

    constructor(readonly clause:Clause){

    }

    async run(): Promise<void> {
        console.warn(`no Action corresponding to predicate ${this.clause.toProlog()}`)
    }
    
}




