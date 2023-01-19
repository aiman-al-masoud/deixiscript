import { getActuator } from "../actuator/Actuator";
import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id"
import getEnviro from "./Enviro";

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
        await getActuator().takeAction(clause.copy({ exactIds: true }), this.enviro)
    }

    async query(clause: Clause): Promise<Map[]> {
        return this.enviro.query(clause)
    }

}

