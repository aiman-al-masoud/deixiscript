import { Clause, emptyClause } from "../../middle/clauses/Clause"
import { getOwnershipChain } from "../../middle/clauses/functions/getOwnershipChain"
import { getTopLevel } from "../../middle/clauses/functions/topLevel"
import { Map } from "../../middle/id/Map"
import Thing from "./Thing"

export function ownerInfo(thing: Thing, q: Clause) {

    //TODO: this unwittinlgy asserts wrong non-relational info about this object "parroting the query".

    const maps = query(thing, q)
    const res = (maps[0] && getOwnershipChain(q, getTopLevel(q)[0]).length > 1) ?
        q.copy({ map: maps[0] })
        : emptyClause

    // console.log('id=', this.id, 'ownerInfo=', res.toString())
    return res
}

function query(thing: Thing, clause: Clause, parentMap: Map = {}): Map[] {

    const oc = getOwnershipChain(clause, getTopLevel(clause)[0])

    if (oc.length === 1) { //BASECASE: check yourself

        if (thing.name === clause.predicate?.root) { //TODO: also handle non-ownership non-intransitive relations!, TODO: handle non BasicClauses!!!! (that don't have ONE predicate!) //problem with comparing referent is that stupid heuristic in getLexemes() does not attempt to query button.style, it just queries button, and so it doesn't get button.styles's lexemes!
            return [{ ...parentMap, [clause.entities[0]]: thing.id }]
        }

        return [] //TODO
    }

    // check your children!

    const top = getTopLevel(clause)

    const aboutTopLevel = clause
        .flatList()
        .filter(x => top.some(t => x.entities.includes(t)))
        .filter(x => x.entities.length <= 1)
        .reduce((a, b) => a.and(b), emptyClause)

    const notOk = aboutTopLevel.flatList().filter(x => !(thing.isAlready({ predicate: x.predicate?.referent!, args: [] }) || thing.name === x.predicate?.root))

    if (notOk.length) {
        return []
    }

    const peeled = clause
        .flatList()
        .filter(x => x.entities.every(e => !top.includes(e)))
        .reduce((a, b) => a.and(b), emptyClause)

    const relevantNames = peeled.flatList().flatMap(x => [x.predicate?.root, x.predicate?.token]).filter(x => x).map(x => x as string)

    const children =
        thing.getAllKeys()
            .filter(x => relevantNames.includes(x))
            .map(x => thing.get(x)) // .filter(x=>x?.unwrap() !== this)
            .filter(x => x)
            .map(x => x as Thing)

    const res = children.flatMap(x => query(x, peeled, { [top[0]]: thing.id }))
    return res

}