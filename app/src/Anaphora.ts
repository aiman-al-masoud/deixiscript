import { getActuator } from "./actuator/Actuator";
import Edit from "./actuator/Edit";
import { BasicClause } from "./clauses/BasicClause";
import { Clause } from "./clauses/Clause";
import { getRandomId, Map } from "./clauses/Id"
import getEnviro from "./enviro/Enviro";

export interface Anaphora {
    assert(clause: Clause): Promise<void>
    query(clause: Clause): Promise<Map[]>
}

export function getAnaphora() {
    return new EnviroAnaphora()
}

class EnviroAnaphora implements Anaphora {

    constructor(protected readonly enviro = getEnviro({ root: undefined })) {

    }

    async assert(clause: Clause): Promise<void> {

        for (const c of clause.flatList().map(c => c as BasicClause)) {

            if (c.args.length === 1) {
                await new Edit(c.args[0], c.predicate, []).run(this.enviro)
            }

        }

        // for (const a of await clause.toAction(clause)) {

        //     if((a as any).clause.args.length === 1){
        //         // console.log((a as any).clause.toString())
        //         await a.run(this.enviro)
        //     }

        // }

        // getActuator().takeAction(clause, this.enviro)

    }

    async query(clause: Clause): Promise<Map[]> {
        return this.enviro.query(clause)
    }

}

