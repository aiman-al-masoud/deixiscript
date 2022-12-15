import Ert from "./Ert"
import Prt from "./Prt"

export default interface Actuator extends Ert, Prt{
    onStateChanged(...actions: Action[]): void
}

export interface Action{
    verb: string
    args: ActionArgs
}

export type Id = number | string


export interface Args<T> {
    subject: T
    predicate?:T
    object?: T
    on?: T
    in?: T
    of?: T
    for?: T
    with?: T
    by?: T
    to?: T
}

export type ActionArgs = Args<Id>
export type ObjArgs = Args<any>

