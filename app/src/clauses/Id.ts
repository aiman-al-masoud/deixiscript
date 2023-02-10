/**
 * Id of an entity.
 */
export type Id = number | string

/**
 * Id to Id mapping, from one "universe" to another.
 */
export type Map = { [a: Id]: Id }


function* getIncrementalIdGenerator() {
    let x = 0
    while (true) {
        x++
        yield x
    }
}

const idGenerator = getIncrementalIdGenerator()

export function getIncrementalId(opts?: GetIncrementalIdOpts): Id {
    const newId = `id${idGenerator.next().value}`
    return opts?.asVar ? toVar(newId) : newId
}

export interface GetIncrementalIdOpts {
    asVar: boolean
}

export function toVar(id: Id): Id {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase()
}

export function isVar(e: Id) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase())
}

export function toConst(id: Id): Id {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toLowerCase()
}



export function idToNum(id: Id) { //TODO: undefined or NaN?
    return parseInt(id.toString().replaceAll(/\D+/g, ''))
}

/**
 * Sort ids in ascending order.
 */
export function sortIds(ids: Id[]) {
    return ids.sort((a, b) => idToNum(a) - idToNum(b))
}