import { getActuator } from "../../backend/actuator/Actuator";
import Wrapper from "../../backend/wrapper/Wrapper";
import { getParser } from "../../frontend/parser/interfaces/Parser";
import { toClause } from "../../middle/toClause";
import { Context } from "../context/Context";
import Brain from "./Brain";
import { pointOut } from "./pointOut";



export default class BasicBrain implements Brain {


    constructor(
        readonly context: Context,
        readonly actuator = getActuator()
    ) {

        Object.defineProperty(Number.prototype, 'add', { writable: true, value: function (a: any) { return this + a } })

        this.context.prelude.forEach(c => this.execute(c))
    }

    execute(natlang: string): Wrapper[] {
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

                const maps = this.context.query(clause)
                const wrappers = maps.flatMap(m=>Object.values(m)).map(id=>this.context.get(id))
                // const wrappers = clause.entities.flatMap(id => getKool(this.context, clause, id))
                this.context.values.forEach(w => pointOut(w, { turnOff: true }))
                wrappers.forEach(w => w ? pointOut(w) : 0)
                return wrappers
            }

        }).flat()
    }

    executeUnwrapped(natlang: string): any[] {
        return this.execute(natlang).map(x => x?.unwrap?.() ?? x)
    }

}