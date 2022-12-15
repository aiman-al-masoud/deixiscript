import Ert from "./Ert"

export default interface Actuator {
    onStateChanged(...actions: Action[]): void
}

export interface Action extends Ert{
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