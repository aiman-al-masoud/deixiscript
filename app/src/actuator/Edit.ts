import { Id } from "../clauses/Id";
import { LexemeType } from "../config/LexemeType";
import { Enviro } from "../enviro/Enviro";
import { Lexeme } from "../lexer/Lexeme";
import Action from "./Action";

export default class Edit implements Action {

    constructor(readonly id: Id, readonly predicate: Lexeme<LexemeType>, readonly props?: Lexeme<LexemeType>[]) {

    }

    async run(enviro: Enviro): Promise<any> {
        const obj = enviro.get(this.id) ?? enviro.setPlaceholder(this.id)
        obj.set(this.predicate, this.props)
    }


}