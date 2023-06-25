import { SyntaxMap } from "./types.ts";


export const maxPrecedence = (a: string, b: string, syntaxes: SyntaxMap) => {

    return idCompare(a, b) ??
        dependencyCompare(a, b, syntaxes) ??
        lenCompare(a, b, syntaxes)

}

const idCompare = (a: string, b: string) => {
    return a == b ? 0 : undefined
}

const dependencyCompare = (a: string, b: string, syntaxes: SyntaxMap) => {

    const aDependsOnB = dependencies(a, syntaxes).includes(b) // could be memoized?
    const bDependsOnA = dependencies(b, syntaxes).includes(a)

    if (aDependsOnB === bDependsOnA) {
        return undefined
    }

    return aDependsOnB ? 1 : -1

}

export function dependencies(a: string, syntaxes: SyntaxMap, visited: string[] = []): string[] { //DFS

    const members = syntaxes[a] ?? []

    return members.flatMap(m => m.types ?? []).flatMap(t => {

        if (visited.includes(t)) {
            return []
        } else {
            return [...visited, ...dependencies(t as string, syntaxes, [...visited, t])]
        }

    })

}

const lenCompare = (a: string, b: string, syntaxes: SyntaxMap) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length
}

