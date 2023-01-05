import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";

export interface Enviro {
    // get(id: Id): Promise<any>
    // set(id: Id, object: any): void
    // query(clause: Clause): Promise<Map[]>
    // get keys(): Id[]
    // get values(): any[]
}

export default function getEnviro(): Enviro {
    return {} as Enviro
}