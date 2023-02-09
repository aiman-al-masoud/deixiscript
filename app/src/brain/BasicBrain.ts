import Brain from "./Brain";
import { getActuator } from "../actuator/actuator/Actuator";
import { toClause } from "./toClause";
import { getParser } from "../parser/interfaces/Parser";
import { Context } from "./Context";
import { pointOut } from "./pointOut";
import { unwrap } from "../enviro/Wrapper";


export default class BasicBrain implements Brain {

    constructor(
        readonly context: Context,
        readonly actuator = getActuator()) {

        this.context.config.startupCommands.forEach(c => this.execute(c))
    }

    execute(natlang: string): any[] {

        return getParser(natlang, this.context).parseAll().map(ast => {

            if (ast.type === 'macro') {
                this.context.config.setSyntax(ast)
                return []
            }

            const clause = toClause(ast).simple
            // console.log(clause.toString())

            if (clause.isSideEffecty) {

                this.actuator.takeAction(clause, this.context)
                return []

            } else {

                const maps = this.context.enviro.query(clause)
                const ids = maps.flatMap(m => Object.values(m))
                const wrappers = ids.map(id => this.context.enviro.get(id))

                this.context.enviro.values.forEach(w => pointOut(w, { turnOff: true }))
                wrappers.forEach(w => w ? pointOut(w) : 0)

                return wrappers.flatMap(o => o ? unwrap(o) : [])
            }

        }).flat()
    }

}