import Action from "./Action";
import { makeLexeme } from "../../frontend/lexer/Lexeme";
import { LexemeType } from "../../config/LexemeType";
import { Clause } from "../../middle/clauses/Clause";
import { Context } from "../../facade/context/Context";

export default class CreateLexemeAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (!context.lexemeTypes.includes(this.clause.predicate?.root as LexemeType)) {
            return
        }

        const name = this.topLevel.theme.describe((this.clause.args as any)[0])[0].root //TODO: could be undefined        
        const type = this.clause.predicate?.root as LexemeType

        const lexeme = makeLexeme({
            root: name,
            type,
        })

        context.setLexeme(lexeme)
    }

}