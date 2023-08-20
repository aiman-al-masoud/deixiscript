import { $ } from "./exp-builder.ts"
import { findAll } from "./findAll.ts"
import { HasSentence, IsASentence, KnowledgeBase, WmAtom, WorldModel, conceptsOf, isIsASentence } from "./types.ts"
import { isNotNullish } from "../utils/isNotNullish.ts"

export function excludedBy(s: HasSentence | IsASentence, kb: KnowledgeBase) {

  if (isIsASentence(s)) {
    return excludedByIsA(s, kb)
  } else {
    return excludedByHas(s, kb)
  }

}

function excludedByHas(h: HasSentence, kb: KnowledgeBase): WorldModel {
  const concepts = conceptsOf(h[0], kb)
  const r = excludedByNumberRestriction(h, kb, concepts)
  const results = r.map(x => [h[0], x, h[2]] as HasSentence)
  return results
}

function excludedByNumberRestriction(h: HasSentence, kb: KnowledgeBase, concepts: WmAtom[]): WmAtom[] {

  const qs2 = concepts.map(c => $({ limitedNumOf: h[2], onConcept: c, max: 'n:number' }))

  const maxes = qs2.flatMap(x => findAll(x.$, [$('n:number').$], kb))
    .map(x => x.get($('n:number').$))
    .filter(isNotNullish)
    .map(x => x.value)

  if (!maxes.length) return []

  // assume oldest-inserted values come first
  const old = findAll($(h[0]).has('y:thing').as(h[2]).$, [$('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(isNotNullish).map(x => x.value).concat(h[1])

  const max = Math.min(...maxes as number[]) // most restrictive
  const throwAway = old.slice(0, old.length - max)
  return throwAway
}

function excludedByIsA(is: IsASentence, kb: KnowledgeBase): WorldModel {

  const concepts = conceptsOf(is[0], kb)
  const qs = concepts.map(c => $({ concept: c, excludes: 'c2:thing' }))

  const r = qs.flatMap(q => findAll(q.$, [$('c2:thing').$], kb))
    .map(x => x.get($('c2:thing').$))
    .filter(isNotNullish)
    .map(x => x.value)
    .filter(x => x !== is[1])

  const result = r.map(x => [is[0], x] as IsASentence)


  return result
}
