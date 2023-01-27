import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import { Id } from "../../clauses/Id";
import { Lexeme } from "../../lexer/Lexeme";
import Action from "./Action";

export default class RelationAction implements Action {

    constructor(
        readonly topLevel: Clause,
        readonly verb: Lexeme,
        readonly args: Id[],
        readonly negated?: boolean) {

    }

    run(context: Context) {

        const subjectId = context
            .enviro
            .query(this.topLevel.theme.about(this.args[0]))
            .at(0)
            ?.[this.args[0]]

        const objectId = context
            .enviro
            .query(this.topLevel.theme.about(this.args[1]))
            .at(0)
            ?.[this.args[1]]

        const subject = context.enviro.get(subjectId ?? '')
        const object = context.enviro.get(objectId ?? '')

        subject?.call(this.verb, [object])
    }

}