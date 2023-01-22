import { Id } from "../clauses/Id";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";

export default class Edit implements Action {

    constructor(readonly id: Id, readonly predicate: string, readonly props?: string[]) {

    }

    async run(enviro: Enviro): Promise<any> {
        const obj = enviro.get(this.id) ?? enviro.setPlaceholder(this.id)
        obj.set(this.predicate, this.props)
    }


}