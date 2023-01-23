import { CompositeType } from "../config/syntaxes"
import { SyntaxMap, AstType } from "./interfaces/Syntax"

export const maxPrecedence = (a: CompositeType, b: CompositeType, syntaxes: SyntaxMap, staticAscendingPrecedence: AstType[]) => {

    return idCompare(a, b) ??
        staticCompare(a, b, staticAscendingPrecedence) ??
        dependencyCompare(a, b, syntaxes) ??
        lenCompare(a, b, syntaxes)

}

const idCompare = (a: AstType, b: AstType) => {
    return a == b ? 0 : undefined
}

function staticCompare(a: AstType, b: AstType, staticByAscPrecedence: AstType[]) {

    const pa = staticByAscPrecedence.indexOf(a)
    const pb = staticByAscPrecedence.indexOf(b)

    if (pa === -1 || pb === -1) { // either one is custom
        return undefined
    }

    return pa - pb
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
    return (syntaxes[a] ?? []).flatMap(m => m.type)
}

const lenCompare = (a: CompositeType, b: CompositeType, syntaxes: SyntaxMap) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length
}
