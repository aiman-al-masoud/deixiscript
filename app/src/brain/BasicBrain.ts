import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";
import { getActuator } from "../actuator/actuator/Actuator";
import { toClause } from "./toClause";
import { Config } from "../config/Config";
import { getParser } from "../parser/interfaces/Parser";


export default class BasicBrain implements Brain {

    constructor(
        readonly config: Config,
        readonly enviro = getEnviro({ root: document.body }),
        readonly actuator = getActuator()) {

        this.config.startupCommands.forEach(c => this.execute(c))
    }

    execute(natlang: string): any[] {

        return getParser(natlang, this.config).parseAll().map(ast => {

            if (ast.type == 'macro') {
                this.config.setSyntax(ast as any)
                return []
            }

            const clause = toClause(ast)

            if (clause.isSideEffecty) {

                this.actuator.takeAction(clause, this.enviro)
                return []

            } else {

                const maps = this.enviro.query(clause)
                const ids = maps.flatMap(m => Object.values(m))
                const objects = ids.map(id => this.enviro.get(id))

                this.enviro.values.forEach(o => o.pointOut({ turnOff: true }))
                objects.forEach(o => o?.pointOut())
                return objects.map(o => o?.object)
            }

        }).flat()
    }

}