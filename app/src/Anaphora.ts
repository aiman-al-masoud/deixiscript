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

    constructor(protected readonly enviro = getEnviro()) {

    }

    async assert(clause: Clause): Promise<void> {

        const clauses = clause
            .flatList()
            .map(c => c as BasicClause)

        for (const c of clauses) {

            if (c.args.length == 1) {

                this.enviro.setPlaceholder(c.args[0])
                const x = await this.enviro.get(c.args[0])
                // console.log(c.args[0], ' is a ', c.predicate)
                x.set(c.predicate)

            }

        }

    }

    async query(clause: Clause): Promise<Map[]> {
        return [await this.enviro.query(clause)]
    }

}

