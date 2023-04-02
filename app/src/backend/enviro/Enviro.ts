import { Clause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    readonly values: Wrapper[]
    readonly root?: HTMLElement
    set(wrapper: Wrapper): Wrapper

    query(clause: Clause): Map[]
    get(id:Id):Wrapper|undefined
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}