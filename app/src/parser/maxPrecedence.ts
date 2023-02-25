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

export function dependencies(a: CompositeType, syntaxes: SyntaxMap, visited: AstType[] = []): AstType[] { //DFS

    const members = syntaxes[a] ?? []

    return members.flatMap(m => m.type).flatMap(t => {

        if (visited.includes(t)) {
            return []
        } else {
            return [...visited, ...dependencies(t as CompositeType, syntaxes, [...visited, t])]
        }

    })

}

const lenCompare = (a: CompositeType, b: CompositeType, syntaxes: SyntaxMap) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length
}
