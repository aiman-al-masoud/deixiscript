import { Clause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    query(clause: Clause): Map[]
    get(id: Id): Wrapper | undefined
    set(wrapper: Wrapper): Wrapper
    readonly values: Wrapper[]
    readonly root?: HTMLElement
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}