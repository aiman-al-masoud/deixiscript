import Brain from "./Brain";
import { getActuator } from "../actuator/actuator/Actuator";
import { toClause } from "./toClause";
import { getParser } from "../parser/interfaces/Parser";
import { Context } from "./Context";


export default class BasicBrain implements Brain {

    constructor(
        readonly context: Context,
        readonly actuator = getActuator()) {

        this.context.config.startupCommands.forEach(c => this.execute(c))
    }

    execute(natlang: string): any[] {

        return getParser(natlang, this.context).parseAll().map(ast => {

            if (ast.type === 'macro') {
                this.context.config.setSyntax(ast as any)
                return []
            }

            const clause = toClause(ast)

            if (clause.isSideEffecty) {

                this.actuator.takeAction(clause, this.context)
                return []

            } else {

                const maps = this.context.enviro.query(clause)
                const ids = maps.flatMap(m => Object.values(m))
                const objects = ids.map(id => this.context.enviro.get(id))

                this.context.enviro.values.forEach(o => o.pointOut({ turnOff: true }))
                objects.forEach(o => o?.pointOut())
                return objects.map(o => o?.object)
            }

        }).flat()
    }

}