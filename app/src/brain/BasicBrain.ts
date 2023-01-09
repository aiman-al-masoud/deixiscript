import { getParser } from "../parser/Parser";
import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";
import { Id } from "../clauses/Id";
import { wrap } from "../enviro/Wrapper";
import { getActuator } from "../actuator/Actuator";


export default class BasicBrain implements Brain {

    constructor(readonly enviro = getEnviro(), readonly actuator = getActuator()) {

        wrap(HTMLButtonElement.prototype).setAlias('color', ['style', 'background'])
        // wrap(HTMLButtonElement.prototype).setAlias('width', ['style', 'width'])

    }

    async execute(natlang: string): Promise<any[]> {

        for (const ast of getParser(natlang).parseAll()) {

            const clause = await ast.toClause()
            console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty)

            if (clause.isSideEffecty) {
                await this.actuator.takeAction(clause, this.enviro) // TODO: make this async-safe
            } else {

                const ids = Object.values(await this.enviro.query(clause))
                    .filter(e => e !== undefined)
                    .map(e => e as Id)

                const objects = await Promise.all(ids.map(e => this.enviro.get(e)))
                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }))
                objects.forEach(o => o.pointOut())
            }

        }

        return []
    }

}