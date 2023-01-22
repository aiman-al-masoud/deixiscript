import { getActuator } from "../actuator/Actuator";
import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id"
import getEnviro from "./Enviro";

export interface Anaphora {
    assert(clause: Clause): void
    query(clause: Clause): Map[]
}

export function getAnaphora() {
    return new EnviroAnaphora()
}

class EnviroAnaphora implements Anaphora {

    constructor(protected readonly enviro = getEnviro({ root: undefined })) {

    }

    assert(clause: Clause) {
        getActuator().takeAction(clause.copy({ exactIds: true }), this.enviro)
    }

    query(clause: Clause): Map[] {
        return this.enviro.query(clause)
    }

}

