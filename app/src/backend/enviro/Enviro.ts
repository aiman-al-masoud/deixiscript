import { Clause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Thing from "../wrapper/Thing";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    query(clause: Clause): Map[]
    get(id: Id): Thing | undefined
    set(wrapper: Thing): Thing
    readonly values: Thing[]
    readonly root?: HTMLElement
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}