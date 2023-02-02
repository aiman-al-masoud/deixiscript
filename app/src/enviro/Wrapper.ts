import { Context } from "../brain/Context"
import { Id } from "../clauses/Id"
import { Lexeme } from "../lexer/Lexeme"
import ConcreteWrapper from "./ConcreteWrapper"

export default interface Wrapper {

    readonly id: Id
    readonly object: any
    set(predicate: Lexeme, props?: Lexeme[]): void
    is(predicate: Lexeme): boolean // TODO args
    setAlias(conceptName: Lexeme, propPath: Lexeme[]): void
    pointOut(opts?: { turnOff: boolean }): void
    call(verb: Lexeme, args: (Wrapper | undefined)[]): any

}

export function wrap(id: Id, o?: Object, context?: Context): Wrapper {
    addNewVerbs(o, context)
    return new ConcreteWrapper(o, id)
}


function addNewVerbs(object?: object, context?: Context) {

    if (context) {
        const props = allPropsOf(object)
        props.forEach(x => {
            if (!context.config.lexemes.map(l => l.root).includes(x)) {
                context.config.setLexeme({ root: x, type: 'mverb' })
            }
        })
    }

}

function allPropsOf(x: any) {

    const result = []
    let y = x

    do {
        result.push(...Object.getOwnPropertyNames(y))
    } while ((y = Object.getPrototypeOf(y)))

    return result
}
