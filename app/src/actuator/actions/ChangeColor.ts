import { Id } from "../../clauses/Id";
import { Ed } from "../Ed";
import Action from "./Action";

export class ChangeColor implements Action {

    constructor(readonly id: Id, readonly color: string, readonly ed: Ed) {

    }

    async run(): Promise<void> {

        const object: HTMLElement = this.ed.get(this.id)
        object.style.background = this.color

    }
}
