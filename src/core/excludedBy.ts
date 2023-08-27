import { $ } from "./exp-builder.ts"
// import { findAll } from "./findAll.ts"
import { HasSentence, IsASentence, KnowledgeBase, LLangAst, WmAtom, WorldModel, conceptsOf, isAtom, isConst, isIsASentence } from "./types.ts"
// import { isNotNullish } from "../utils/isNotNullish.ts"
import { evaluate } from "./evaluate.ts";

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

  // const qs2 = concepts.map(c => $({ limitedNumOf: h[2], onConcept: c, max: 'n:number' }))
  const qs2Bad = concepts.map(c => $('n:number').suchThat($({ limitedNumOf: h[2], onConcept: c, max: 'n:number' }), Infinity).$)

  const maxes = qs2Bad.map(x => evaluate(x, kb).result)
    .flatMap(foo)
    .filter(isAtom)
    .filter(x => x.type !== 'nothing')
    .map(x => x.value)

  // const maxes = 
  //   qs2.flatMap(x => findAll(x.$, [$('n:number').$], kb))
  //   .map(x => x.get($('n:number').$))
  //   .filter(isNotNullish)
  //   .map(x => x.value)

  // console.log(maxesBad, maxes)

  if (!maxes.length) return []

  const old = foo(evaluate($('y:thing').suchThat($(h[0]).has('y:thing').as(h[2]).$, Infinity).$, kb).result).filter(isConst).filter(x => x.type !== 'nothing').map(x => x.value).concat(h[1])

  // assume oldest-inserted values come first
  // const good = findAll($(h[0]).has('y:thing').as(h[2]).$, [$('y:thing').$], kb).map(x => x.get($('y:thing').$)).filter(isNotNullish).map(x => x.value).concat(h[1])

  // console.log(old, good)

  const max = Math.min(...maxes as number[]) // most restrictive
  const throwAway = old.slice(0, old.length - max)
  return throwAway
}

function excludedByIsA(is: IsASentence, kb: KnowledgeBase): WorldModel {

  const concepts = conceptsOf(is[0], kb)
  const qs = concepts.map(c => $('c2:thing').suchThat($({ concept: c, excludes: 'c2:thing' }), Infinity))

  // evaluate()
  // $()
  // $({ concept: c, excludes: 'c2:thing' })

  const r = qs.flatMap(q => evaluate(q.$, kb).result)
    .flatMap(foo)
    .filter(isAtom)
    .map(x => x.value)
    .filter(x => x !== is[1])
  // .map(x => x.get($('c2:thing').$))
  // .filter(isNotNullish)

  const result = r.map(x => [is[0], x] as IsASentence)

  return result
}


function foo(x: LLangAst): LLangAst[] {
  // console.log(x)
  if (x.type === 'conjunction') return [...foo(x.f2), ...foo(x.f1)] // reverse: oldest first
  return [x]
}