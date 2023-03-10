import { getActuator } from "../../backend/actuator/Actuator";
import { getParser } from "../../frontend/parser/interfaces/Parser";
import { getKool } from "../../middle/clauses/functions/getKool";
import { toClause } from "../../middle/toClause";
import { Context } from "../context/Context";
import Brain from "./Brain";
import { pointOut } from "./pointOut";



export default class BasicBrain implements Brain {


    constructor(
        readonly context: Context,
        readonly actuator = getActuator()
    ) {
        this.context.prelude.forEach(c => this.execute(c))
    }

    execute(natlang: string): any[] {

        return getParser(natlang, this.context).parseAll().map(ast => {

            if (ast.type === 'macro') {
                this.context.setSyntax(ast)
                return []
            }

            const clause = toClause(ast).simple
            // console.log(clause.toString())

            if (clause.isSideEffecty) {

                return this.actuator.takeAction(clause, this.context)

            } else {

                const wrappers = clause.entities.flatMap(id => getKool(this.context, clause, id))

                this.context.values.forEach(w => pointOut(w, { turnOff: true }))
                wrappers.forEach(w => w ? pointOut(w) : 0)

                return wrappers.flatMap(o => o ? o.unwrap() : [])
            }

        }).flat()
    }

}