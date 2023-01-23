import { Id } from "../../clauses/Id";
import { Enviro } from "../../enviro/Enviro";
import { Lexeme } from "../../lexer/Lexeme";
import Action from "./Action";

export default class EditAction implements Action {

    constructor(readonly id: Id, readonly predicate: Lexeme, readonly props?: Lexeme[]) {

    }

    async run(enviro: Enviro): Promise<any> {
        const obj = enviro.get(this.id) ?? enviro.setPlaceholder(this.id)
        obj.set(this.predicate, this.props)
    }


}