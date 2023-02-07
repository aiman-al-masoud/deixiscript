import { clauseOf } from "../../clauses/Clause";
import { Context } from "../../brain/Context";
import { wrap } from "../../enviro/Wrapper";
import { getProto } from "../../lexer/functions/getProto";
import Action from "./Action";
import { getRandomId } from "../../clauses/Id";
import Imply from "../../clauses/Imply";

export default class ImplyAction implements Action {

    constructor(
        readonly clause: Imply,
        protected readonly condition = clause.theme,
        protected readonly conclusion = clause.rheme) {

    }

    run(context: Context): any {

        const isSetAliasCall =  // assume if "of" in condition AND conclusion that it's a set alias call
            this.condition.getOwnershipChain(this.condition.topLevel()[0]).slice(1).length
            && this.conclusion.getOwnershipChain(this.conclusion.topLevel()[0]).slice(1).length

        if (isSetAliasCall) {
            this.setAliasCall(context)
        } else {
            this.other(context)
        }

    }

    setAliasCall(context: Context) {

        const top = this.condition.topLevel()[0] //TODO (!ASSUME!) same as top in conclusion
        const alias = this.condition.getOwnershipChain(top).slice(1)
        const props = this.conclusion.getOwnershipChain(top).slice(1)
        const conceptName = alias.map(x => this.condition.describe(x)[0]) // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]) // same ...
        const protoName = this.condition.describe(top)[0] // assume one 
        const proto = getProto(protoName)

        wrap(getRandomId(), proto).set(conceptName[0], { aliasPath: propsNames })
    }

    other(context: Context) {
        const top = this.condition.topLevel()[0]
        const protoName = this.condition.describe(top)[0] // assume one 
        const predicate = this.conclusion.describe(top)[0]
        const y = context.enviro.query(clauseOf(protoName, 'X'))
        const ids = y.map(m => m['X'])
        ids.forEach(id => context.enviro.get(id)?.set(predicate, { negated: this.conclusion.negated }))
    }

}
