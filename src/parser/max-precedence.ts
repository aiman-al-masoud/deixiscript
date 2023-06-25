import { SyntaxMap } from "./types.ts";

type t = { [x: string]: string[] }

export const maxPrecedence = (a: string, b: string, deps: t) => {
    return idCompare(a, b) ??
        dependencyCompare(a, b, deps) ??
        lenCompare(a, b, deps)
}

const idCompare = (a: string, b: string) => {
    return a == b ? 0 : undefined
}

const dependencyCompare = (a: string, b: string, deps: t) => {

    const aDependsOnB = deps[a].includes(b)
    const bDependsOnA = deps[b].includes(a)

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
            return [...visited, ...dependencies(t, syntaxes, [...visited, t])]
        }

    })

}

const lenCompare = (a: string, b: string, deps: t) => {
    return deps[a].length - deps[b].length
}
