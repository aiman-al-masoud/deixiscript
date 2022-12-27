import { Id } from "../../clauses/Id";
import { Ed } from "../Ed";
import Action from "./Action";

export class MakeButton implements Action {

    constructor(readonly id: Id, readonly ed: Ed) {
        
    }

    async run(): Promise<void> {

        if (!this.ed.get(this.id)) {
            const button = document.createElement('button');
            button.innerText = 'button';
            document.body.appendChild(button);
            this.ed.set(this.id, button);
        }

    }
}
