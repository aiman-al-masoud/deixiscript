import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "../concepts/Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Promise<Wrapper>
    set(id: Id, object: Wrapper): void
    // query(clause: Clause): Promise<Map[]> //TODO!!!!!!!!!    
    query(clause: Clause): Promise<{ [id: Id]: Id | undefined }>
    // get keys(): Id[]
    // get values(): any[]
}

export default function getEnviro(): Enviro {
    return new BaseEnviro()
}