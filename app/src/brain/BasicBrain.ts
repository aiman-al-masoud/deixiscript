import { getParser } from "../parser/Parser";
import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";
import { getActuator } from "../actuator/Actuator";
import { toClause } from "../parser/toClause";
import { Config } from "../config/Config";


export default class BasicBrain implements Brain {

    constructor(readonly config: Config, readonly enviro = getEnviro({ root: document.body }), readonly actuator = getActuator()) {

    }

    async init() {
        for (const s of this.config.startupCommands) {
            await this.execute(s)
        }
    }

    async execute(natlang: string): Promise<any[]> {

        const results: any[] = []

        for (const ast of getParser(natlang, this.config).parseAll()) {

            if (!ast) {
                continue
            }

            const clause = await toClause(ast)

            if (clause.isSideEffecty) {

                await this.actuator.takeAction(clause, this.enviro)

            } else {

                const maps = await this.enviro.query(clause)
                const ids = maps.flatMap(m => Object.values(m))
                const objects = await Promise.all(ids.map(id => this.enviro.get(id)))

                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }))
                objects.forEach(o => o?.pointOut())
                objects.map(o => o?.object).forEach(o => results.push(o))

            }

        }

        return results
    }

}