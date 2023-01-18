import { BasicClause } from "../clauses/BasicClause";
import { Clause } from "../clauses/Clause";
import { getRandomId } from "../clauses/Id";
import { Enviro } from "../enviro/Enviro";
import Action from "./Action";
import Create from "./Create";
import Edit from "./Edit";

export default class BasicAction implements Action {

    constructor(readonly clause: BasicClause, readonly topLevel: Clause) {

    }

    async run(enviro: Enviro): Promise<any> {

        if (this.clause.exactIds) {
            return await new Edit(this.clause.args[0], this.clause.predicate, []).run(enviro)
        }

        if (this.clause.args.length > 1) { // not handling relations yet
            return
        }

        if (!this.topLevel.topLevel().includes(this.clause.args[0])) { // non top level entities

            // console.log('non top level handler', this.clause.predicate)

            // assuming max x.y.z nesting
            const owners = this.topLevel.ownersOf(this.clause.args[0])

            const hasTopLevel = owners.filter(x=>this.topLevel.topLevel().includes(x))[0]

            const topLevelOwner =  hasTopLevel? hasTopLevel: this.topLevel.ownersOf(owners[0])[0]

            // const topLevelOwner = this.topLevel.ownersOf(owners[0])[0] 
                        
            const props = this.topLevel
            .getOwnershipChain(topLevelOwner)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0])

            
            if (topLevelOwner === undefined) {
                return
            }

            
            const nameOfThis = this.topLevel.theme.describe(this.clause.args[0])
            const nameOfTopLevelOwner = this.topLevel.describe(topLevelOwner) 
            
            if (this.clause.predicate === nameOfThis[0]) {
                return
            }
            
            // console.log(this.clause.predicate, {props}, {topLevelOwner})
            // console.log(nameOfThis, 'is', this.clause.predicate, 'and is owned by', nameOfTopLevelOwner)
            
            const q = this.topLevel.theme.about(topLevelOwner)
            const maps = await enviro.query(q)
            const id = maps?.[0]?.[topLevelOwner] //?? getRandomId()

            return new Edit(id, this.clause.predicate, props).run(enviro)
        }

        const q = this.topLevel.theme.about(this.clause.args[0])
        const maps = await enviro.query(q)
        const id = maps?.[0]?.[this.clause.args[0]] ?? getRandomId()

        if (!await enviro.get(id)) {
            enviro.setPlaceholder(id)
        }

        if (isCreatorAction(this.clause.predicate)) {

            new Create(id, this.clause.predicate).run(enviro)

        } else { // Edit Action

            const props = this.topLevel
                .getOwnershipChain(this.clause.args[0])
                .slice(1)
                .map(e => this.topLevel.theme.describe(e)[0])

            new Edit(id, this.clause.predicate, props).run(enviro)
        }

    }

}

function isCreatorAction(predicate: string) {
    return predicate === 'button'
}