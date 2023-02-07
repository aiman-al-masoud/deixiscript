import { Clause } from "../clauses/Clause";
import { Id, Map } from "../clauses/Id";
import Wrapper from "./Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Wrapper | undefined
    set(id: Id, object?: object): Wrapper
    query(clause: Clause): Map[]
    readonly values: Wrapper[]
    readonly root?: HTMLElement
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}