import { takeAction } from "../action/Action";
import { getParser } from "../parser/Parser";
import Brain from "./Brain";
import getEnviro from "../enviro/Enviro";
import { Id } from "../clauses/Id";


export default class BasicBrain implements Brain {

    constructor(readonly enviro = getEnviro()) {

    }

    async execute(natlang: string): Promise<any[]> {

        for (const ast of getParser(natlang).parseAll()) {

            const clause = await ast.toClause()
            console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty)

            if (clause.isSideEffecty) {
                await takeAction(clause, this.enviro) // TODO: make this async-safe
            } else {

                const ids = Object.values(await this.enviro.query(clause))
                    .filter(e => e !== undefined)
                    .map(e => e as Id)

                const objects = await Promise.all(ids.map(e => this.enviro.get(e)))
                objects.forEach(o => this.pointOut(o.object))
            }

        }

        return []
    }

    protected setColoredOutline(object: any, opts?: { turnOff: boolean }) {

        if (object instanceof HTMLElement) {
            object.style.outline = opts?.turnOff ? '' : '#f00 solid 2px'
        }

    }

    protected pointOut(object: any) {

        console.log(object)

        this.enviro.values.forEach(o => {
            this.setColoredOutline(o.object, { turnOff: true })
        })

        this.setColoredOutline(object)

    }

}