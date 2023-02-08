import { Context } from "../../brain/Context";
import { Clause } from "../../clauses/Clause";
import { getRandomId } from "../../clauses/Id";
import { wrap } from "../../enviro/Wrapper";
import { getProto } from "../../lexer/functions/getProto";
import Action from "./Action";

export default class SetAliasAction implements Action {


    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const condition = this.clause.theme
        const consequence = this.clause.rheme

        const top = condition.topLevel()[0] //TODO (!ASSUME!) same as top in conclusion
        const alias = condition.getOwnershipChain(top).slice(1)
        const props = consequence.getOwnershipChain(top).slice(1)
        const conceptName = alias.map(x => condition.describe(x)[0]) // assume at least one name
        const propsNames = props.map(x => consequence.describe(x)[0]) // same ...
        const protoName = condition.describe(top)[0] // assume one 
        const proto = getProto(protoName)

        wrap(getRandomId(), proto).set(conceptName[0], { aliasPath: propsNames })
    }

}