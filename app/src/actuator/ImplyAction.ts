import { Clause } from "../clauses/Clause";
import { Enviro } from "../enviro/Enviro";
import { wrap } from "../enviro/Wrapper";
import Action from "./Action";

export default class ImplyAction implements Action {

    constructor(readonly condition: Clause, readonly conclusion: Clause) {

    }

    async run(enviro: Enviro): Promise<any> {
        // console.log('ImplyAction.run()', this.condition.toString(), '--->', this.conclusion.toString())

        const top = this.condition.topLevel()[0] //TODO (!ASSUME!) same as top in conclusion

        const alias = this.condition.getOwnershipChain(top).slice(1)
        const props = this.conclusion.getOwnershipChain(top).slice(1)

        // console.log(alias, '--->', props)
        // console.log(this.condition.describe(top), this.conclusion.describe(top))


        const conceptName = alias.map(x => this.condition.describe(x)[0]) // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]) // same ...

        // console.log({ conceptName }, { propsNames })

        const protoName = this.condition.describe(top)[0] // assume one 
        const proto = getProto(protoName)

        // wrap(HTMLButtonElement.prototype).setAlias('color', ['style', 'background'])
        wrap(proto).setAlias(conceptName[0], propsNames)
        // console.log(`wrap(${proto}).setAlias(${conceptName[0]}, [${propsNames}])`)

    }

}


const getProto = (name: string) =>
({
    'button': HTMLButtonElement.prototype
}[name])
