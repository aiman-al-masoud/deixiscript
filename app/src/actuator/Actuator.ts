export default interface Actuator {
    onStateChanged(...actions: Action[]): void
}

export interface Action {
    verb: string
    args: ActionArgs
}

type Id = number | string

export interface ActionArgs {
    subject?: Id
    object?: Id
    on?: Id
    with?: Id
    for?: Id
    by?: Id
    to?: Id
}