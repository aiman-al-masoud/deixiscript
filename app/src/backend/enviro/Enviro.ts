import { Clause } from "../../middle/clauses/Clause";
import { ThingMap } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    set(wrapper: Wrapper): Wrapper
    query(clause: Clause): ThingMap[]
    readonly values: Wrapper[]
    readonly root?: HTMLElement
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}