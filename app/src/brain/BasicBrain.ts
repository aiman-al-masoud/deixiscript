import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";
import { getActuator } from "../actuator/Actuator";
import { toClause } from "../parser/toClause";
import { Config } from "../config/Config";
import { getParser } from "../parser/interfaces/Parser";


export default class BasicBrain implements Brain {

    constructor(readonly config: Config, readonly enviro = getEnviro({ root: document.body }), readonly actuator = getActuator()) {

    }

    init() {
        for (const s of this.config.startupCommands) {
            this.execute(s)
        }
    }

    execute(natlang: string): any[] {

        const results: any[] = []

        for (const ast of getParser(natlang, this.config).parseAll()) {

            if (!ast) {
                continue
            }

            if (ast.type == 'macro') {
                this.config.setSyntax(ast as any)
                continue
            }

            const clause = toClause(ast)

            if (clause.isSideEffecty) {
                this.actuator.takeAction(clause, this.enviro)
            } else {
                const maps = this.enviro.query(clause)
                const ids = maps.flatMap(m => Object.values(m))
                const objects = ids.map(id => this.enviro.get(id))

                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }))
                objects.forEach(o => o?.pointOut())
                objects.map(o => o?.object).forEach(o => results.push(o))
            }

        }

        return results
    }

}