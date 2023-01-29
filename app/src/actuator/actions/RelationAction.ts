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

        const subject = context.enviro.get(this.args[0])
        const object = context.enviro.get(this.args[1])

        return subject?.call(this.verb, [object])
    }

}