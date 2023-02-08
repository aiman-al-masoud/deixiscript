import { Clause } from "../../clauses/Clause";
import { Context } from "../../brain/Context";
import Action from "./Action";

export default class ConceptAction implements Action {
    
    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (this.clause.args && this.clause.predicate) {

            const adj = this.topLevel.theme.describe(this.clause.args[0])[0].root

            context.config.setLexeme({
                root: adj,
                type: 'adjective', //TODO: be able to declare any kind of lexeme like this
                concepts: [this.clause.predicate.root],
            })
        }

    }


}