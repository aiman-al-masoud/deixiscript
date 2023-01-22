import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "./Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Wrapper | undefined
    set(id: Id, object: Wrapper): void
    setPlaceholder(id: Id): Wrapper
    query(clause: Clause): Map[]
    exists(id: Id): boolean
    get values(): Wrapper[]
    readonly root?: HTMLElement
    // get keys(): Id[]
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}