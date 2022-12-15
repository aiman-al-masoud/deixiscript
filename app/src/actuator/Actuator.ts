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

export interface ActionArgs {
    subject: Id
    predicate?:Id
    object?: Id
    on?: Id
    with?: Id
    for?: Id
    by?: Id
    to?: Id
}