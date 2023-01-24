import { Id } from "../../clauses/Id";
import { Context } from "../../Context";
import { Enviro } from "../../enviro/Enviro";
import { Lexeme } from "../../lexer/Lexeme";
import Action from "./Action";

export default class EditAction implements Action {

    constructor(readonly id: Id, readonly predicate: Lexeme, readonly props?: Lexeme[]) {

    }

    async run(context: Context): Promise<any> {
        const obj = context.enviro.get(this.id) ?? context.enviro.setPlaceholder(this.id)
        obj.set(this.predicate, this.props)
    }


}