import { getActuator } from "../actuator/actuator/Actuator";
import { getNewContext } from "../brain/Context";
import { Clause } from "../clauses/Clause";
import { Map } from "../clauses/Id"

export interface Anaphora {
    assert(clause: Clause): void
    query(clause: Clause): Map[]
}

export function getAnaphora(): Anaphora {
    return new EnviroAnaphora()
}

class EnviroAnaphora implements Anaphora {

    constructor(protected readonly context = getNewContext({ root: undefined })) {

    }

    assert(clause: Clause) {
        getActuator().takeAction(clause.copy({ exactIds: true }), this.context)
    }

    query(clause: Clause): Map[] {
        return this.context.enviro.query(clause)
    }

}