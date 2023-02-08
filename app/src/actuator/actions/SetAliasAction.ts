import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import { wrap } from "../../enviro/Wrapper";
import { getProto } from "../../lexer/functions/getProto";
import Action from "./Action";

export default class SetAliasAction implements Action {


    constructor(
        readonly clause: Clause,
        readonly condition = clause.theme,
        readonly conclusion = clause.rheme) {

    }

    run(context: Context) {

        const top = this.condition.topLevel()[0] //TODO (!ASSUME!) same as top in conclusion
        const alias = this.condition.getOwnershipChain(top).slice(1)
        const props = this.conclusion.getOwnershipChain(top).slice(1)
        const conceptName = alias.map(x => this.condition.describe(x)[0]) // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]) // same ...
        const protoName = this.condition.describe(top)[0] // assume one 
        const proto = getProto(protoName)

        wrap(getRandomId(), proto).set(conceptName[0], { aliasPath: propsNames })
    }

}