import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "./Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Promise<Wrapper | undefined>
    set(id: Id, object: Wrapper): void
    setPlaceholder(id: Id): void
    query(clause: Clause): Promise<Map[]>
    exists(id: Id): boolean
    get values(): Wrapper[]
    // get keys(): Id[]
}

export default function getEnviro(): Enviro {
    return new BaseEnviro()
}