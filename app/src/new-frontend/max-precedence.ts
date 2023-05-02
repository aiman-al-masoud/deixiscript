import { AstType, Syntax } from "./csts"

export const maxPrecedence = (a: AstType, b: AstType, syntaxes: { [x in AstType]: Syntax }) => {

    return idCompare(a, b) ??
        dependencyCompare(a, b, syntaxes) ??
        lenCompare(a, b, syntaxes)

}

const idCompare = (a: AstType, b: AstType) => {
    return a == b ? 0 : undefined
}

const dependencyCompare = (a: AstType, b: AstType, syntaxes: { [x in AstType]: Syntax }) => {

    const aDependsOnB = dependencies(a, syntaxes).includes(b)
    const bDependsOnA = dependencies(b, syntaxes).includes(a)

    if (aDependsOnB === bDependsOnA) {
        return undefined
    }

    return aDependsOnB ? 1 : -1

}

export function dependencies(a: AstType, syntaxes: { [x in AstType]: Syntax }, visited: AstType[] = []): AstType[] { //DFS

    const members = syntaxes[a] ?? []

    return members.flatMap(m => m.types ?? []).flatMap(t => {

        if (visited.includes(t)) {
            return []
        } else {
            return [...visited, ...dependencies(t as AstType, syntaxes, [...visited, t])]
        }

    })

}

const lenCompare = (a: AstType, b: AstType, syntaxes: { [x in AstType]: Syntax }) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length
}
