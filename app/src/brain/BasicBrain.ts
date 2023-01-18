import { getParser } from "../parser/Parser";
import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";
import { Id } from "../clauses/Id";
import { getActuator } from "../actuator/Actuator";


export default class BasicBrain implements Brain {

    constructor(readonly enviro = getEnviro({ root: document.body }), readonly actuator = getActuator()) {

        // wrap(HTMLButtonElement.prototype).setAlias('color', ['style', 'background'])
        // wrap(HTMLButtonElement.prototype).setAlias('width', ['style', 'width'])

    }

    async init() {
        await this.execute('color of any button is background of style of button')
    }

    async execute(natlang: string): Promise<any[]> {

        let results: any[] = []

        for (const ast of getParser(natlang).parseAll()) {

            const clause = await ast.toClause()

            if (clause.isSideEffecty) {
                await this.actuator.takeAction(clause, this.enviro) // TODO: make this async-safe

            } else {

                const ids = Object.values((await this.enviro.query(clause))[0] ?? {})
                    .filter(e => e !== undefined)
                    .map(e => e as Id)

                const objects = await Promise.all(ids.map(e => this.enviro.get(e)))
                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }))
                objects.forEach(o => o?.pointOut())
                results = [...results, ...objects.map(o => o?.object)]
            }

        }

        return results
    }

}