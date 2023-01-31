import { getRandomId, Id } from "../../clauses/Id";
import { Context } from "../../brain/Context";
import { Lexeme } from "../../lexer/Lexeme";
import Action from "./Action";
import { Clause } from "../../clauses/Clause";
import { lookup } from "./getAction";

export default class EditAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (this.clause.args && this.topLevel.topLevel().includes(this.clause.args[0])) {
            this.forTopLevel(context)
        } else {
            this.forNonTopLevel(context)
        }

    }

    protected forTopLevel(context: Context) {

        const localId = this.clause.args?.[0]
        const predicate = this.clause.predicate

        if (!localId || !predicate) {
            return
        }

        this.set(localId, predicate, this.getProps(localId), context)
    }

    protected forNonTopLevel(context: Context) {

        const localId = this.clause.args?.[0]
        const predicate = this.clause.predicate

        if (!localId || !predicate) {
            return
        }

        const ownerLocalId = this.topLevel.getTopLevelOwnerOf(localId)
        const propName = this.topLevel.theme.describe(localId)

        if (!ownerLocalId || this.clause?.predicate?.root === propName[0].root) {
            return
        }

        this.set(ownerLocalId, predicate, this.getProps(ownerLocalId), context)
    }

    protected set(localId: Id, predicate: Lexeme, props: Lexeme[], context: Context) {

        const id = lookup(localId, context, this.topLevel, this.clause.exactIds) ?? getRandomId()
        const obj = context.enviro.get(id) ?? context.enviro.setPlaceholder(id)
        obj.set(predicate, props)
    }

    protected getProps(topLevelEntity: Id) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]) // ASSUME at least one
    }

}