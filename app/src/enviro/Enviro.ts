import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "../concepts/Wrapper";

export interface Enviro {
    get(id: Id): Promise<Wrapper>
    set(id: Id, object: Wrapper): void
    query(clause: Clause): Promise<Map[]>
    // get keys(): Id[]
    // get values(): any[]
}

export default function getEnviro(): Enviro {
    return {} as Enviro
}