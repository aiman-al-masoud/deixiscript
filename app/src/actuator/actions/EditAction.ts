import { Id } from "../../id/Id";
import { getIncrementalId } from "../../id/functions/getIncrementalId";
import { Context } from "../../brain/Context";
import { Lexeme } from "../../lexer/Lexeme";
import Action from "./Action";
import { Clause } from "../../clauses/Clause";
import { lookup } from "./getAction";
import { getOwnershipChain } from "../../clauses/functions/getOwnershipChain";
import { getTopLevel } from "../../clauses/functions/topLevel";
import { getTopLevelOwnerOf } from "../../clauses/functions/getTopLevelOwnerOf";

export default class EditAction implements Action {

    constructor(readonly clause: Clause, readonly topLevel: Clause) {

    }

    run(context: Context) {

        if (this.clause.args && getTopLevel(this.topLevel).includes(this.clause.args[0])) {
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

        this.set(localId, predicate, [], context)
    }

    protected forNonTopLevel(context: Context) {

        const localId = this.clause.args?.[0]
        const predicate = this.clause.predicate

        if (!localId || !predicate) {
            return
        }

        const ownerLocalId = getTopLevelOwnerOf(localId, this.topLevel)

        if (!ownerLocalId) {
            return
        }

        this.set(ownerLocalId, predicate, this.getProps(ownerLocalId), context)
    }

    protected set(localId: Id, predicate: Lexeme, props: Lexeme[], context: Context) {
        const id = lookup(localId, context, this.topLevel) ?? getIncrementalId()
        const obj = context.enviro.get(id) ?? context.enviro.set(id)
        obj.set(predicate, { props, negated: this.clause.negated })
    }

    protected getProps(topLevelEntity: Id) {
        return getOwnershipChain(this.topLevel, topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]) // ASSUME at least one
    }

}