import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "./Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Promise<Wrapper>
    set(id: Id, object: Wrapper): void
    setPlaceholder(id: Id): void
    query(clause: Clause): Promise<Map> //TODO: return a list of maps, Map[], when mutliple elements match query!
    exists(id: Id): boolean
    get values(): Wrapper[]
    // get keys(): Id[]
}

export default function getEnviro(): Enviro {
    return new BaseEnviro()
}