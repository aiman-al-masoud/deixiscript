/**
 * Id of an entity.
 */
export type Id = number | string

/**
 * Id to Id mapping, from one "universe" to another.
 */
export type Map = { [a: Id]: Id }


function* getIdGenerator() {
    let x = 0
    while (true) {
        x++
        yield x
    }
}

const idGenerator = getIdGenerator()

export function getRandomId(opts?: GetRandomIdOpts): Id {
    
    // const newId = `id${parseInt(1000 * Math.random() + '')}`

    const newId = `id${idGenerator.next().value}`

    return opts?.asVar ? toVar(newId) : newId
}

export interface GetRandomIdOpts {
    asVar: boolean
}

export function toVar(id: Id): Id {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase()
}

export function isVar(e: Id) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase())
}

