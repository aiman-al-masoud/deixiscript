import { Clause } from "../clauses/Clause";
import { Id } from "../clauses/Id";
import Wrapper from "../concepts/Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Promise<Wrapper>
    set(id: Id, object: Wrapper): void
    setPlaceholder(id:Id):void
    // query(clause: Clause): Promise<Map[]> //TODO!!!!!!!!!    
    query(clause: Clause): Promise<{ [id: Id]: Id | undefined }>
    exists(id:Id):boolean
    // get keys(): Id[]
    // get values(): any[]
}

export default function getEnviro(): Enviro {
    return new BaseEnviro()
}