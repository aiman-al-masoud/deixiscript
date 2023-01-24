import { Clause } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";
import { Context } from "../../Context";
import { Lexeme } from "../../lexer/Lexeme";
import Action from "./Action";

export default class ConceptAction implements Action {

    constructor(readonly id: Id, readonly concept: Lexeme, readonly topLevel: Clause) {

    }

    run(context: Context) {

        const inst = this.topLevel.theme.describe(this.id)[0].root

        context.config.setLexeme({
            root: inst,
            type: 'adj',
            concepts: [this.concept.root],
        })

    }


}