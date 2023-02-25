import { getIncrementalId } from "../../middle/id/functions/getIncrementalId";
import { wrap } from "../wrapper/Wrapper";
import Action from "./Action";
import { Clause } from "../../middle/clauses/Clause";
import { getOwnershipChain } from "../../middle/clauses/functions/getOwnershipChain";
import { getTopLevel } from "../../middle/clauses/functions/topLevel";
import { Context } from "../../facade/context/Context";

export default class SetAliasAction implements Action {


    constructor(readonly clause: Clause) {

    }

    run(context: Context) {

        const condition = this.clause.theme
        const consequence = this.clause.rheme

        const top = getTopLevel(condition)[0] //TODO (!ASSUME!) same as top in conclusion
        const alias = getOwnershipChain(condition, top).slice(1)
        const props = getOwnershipChain(consequence, top).slice(1)
        const conceptName = alias.map(x => condition.describe(x)[0]) // assume at least one name
        const propsNames = props.map(x => consequence.describe(x)[0]) // same ...
        const protoName = condition.describe(top)[0] // assume one 
        // const proto = getProto(protoName)


        wrap(getIncrementalId(), protoName.getProto()).set(conceptName[0], { aliasPath: propsNames })
    }

}