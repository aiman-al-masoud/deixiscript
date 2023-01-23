
import { Clause, clauseOf } from "../../clauses/Clause";
import { Enviro } from "../../enviro/Enviro";
import { wrap } from "../../enviro/Wrapper";
import { getProto } from "../../lexer/Lexeme";
import Action from "./Action";
import EditAction from "./EditAction";

export default class ImplyAction implements Action {

    constructor(readonly condition: Clause, readonly conclusion: Clause) {

    }

    run(enviro: Enviro): any {

        const isSetAliasCall =  // assume if at least one owned entity that it's a set alias call
            this.condition.getOwnershipChain(this.condition.topLevel()[0]).slice(1).length
            || this.conclusion.getOwnershipChain(this.conclusion.topLevel()[0]).slice(1).length

        if (isSetAliasCall) {
            this.setAliasCall()
        } else {
            this.other(enviro)
        }


    }

    setAliasCall() {

        const top = this.condition.topLevel()[0] //TODO (!ASSUME!) same as top in conclusion
        const alias = this.condition.getOwnershipChain(top).slice(1)
        const props = this.conclusion.getOwnershipChain(top).slice(1)
        const conceptName = alias.map(x => this.condition.describe(x)[0]) // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]) // same ...
        const protoName = this.condition.describe(top)[0] // assume one 
        const proto = getProto(protoName)
        wrap(proto).setAlias(conceptName[0], propsNames)
        // console.log(`wrap(${proto}).setAlias(${conceptName[0]}, [${propsNames}])`)
    }

    other(enviro: Enviro) {
        const top = this.condition.topLevel()[0]
        const protoName = this.condition.describe(top)[0] // assume one 
        const predicate = this.conclusion.describe(top)[0]
        const y = enviro.query(clauseOf(protoName, 'X'))
        const ids = y.map(m => m['X'])
        ids.forEach(id => new EditAction(id, predicate).run(enviro))
    }

}

