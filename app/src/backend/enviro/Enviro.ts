import { Lexeme } from "../../frontend/lexer/Lexeme";
import { Clause } from "../../middle/clauses/Clause";
import { Id } from "../../middle/id/Id";
import { Map } from "../../middle/id/Map";
import Wrapper from "../wrapper/Wrapper";
import BaseEnviro from "./BaseEnviro";

export interface Enviro {
    get(id: Id): Wrapper | undefined
    set(args: SetArgs1 | SetArgs2): Wrapper
    query(clause: Clause): Map[]
    readonly values: Wrapper[]
    readonly root?: HTMLElement
}

export interface SetArgs1 {
    type: 1,
    id: Id,
    preds: Lexeme[],
    object?: object,
}

export interface SetArgs2 {
    type: 2,
    wrapper: Wrapper,
}

export default function getEnviro(opts?: GetEnviroOps): Enviro {
    return new BaseEnviro(opts?.root)
}

export interface GetEnviroOps {
    root?: HTMLElement
}