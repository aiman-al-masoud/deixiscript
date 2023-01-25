import { CompositeType } from "../config/syntaxes"
import { SyntaxMap, AstType } from "./interfaces/Syntax"

export const maxPrecedence = (a: CompositeType, b: CompositeType, syntaxes: SyntaxMap) => {

    return idCompare(a, b) ??
        dependencyCompare(a, b, syntaxes) ??
        lenCompare(a, b, syntaxes)

}

const idCompare = (a: AstType, b: AstType) => {
    return a == b ? 0 : undefined
}

const dependencyCompare = (a: CompositeType, b: CompositeType, syntaxes: SyntaxMap) => {

    const aDependsOnB = dependencies(a, syntaxes).includes(b)
    const bDependsOnA = dependencies(b, syntaxes).includes(a)

    if (aDependsOnB === bDependsOnA) {
        return undefined
    }

    return aDependsOnB ? 1 : -1

}

function dependencies(a: CompositeType, syntaxes: SyntaxMap): AstType[] {

    const x = (syntaxes[a] ?? []).flatMap(m => m.type)
    return x
}

const lenCompare = (a: CompositeType, b: CompositeType, syntaxes: SyntaxMap) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length
}
