import { $ } from "./exp-builder.ts"
import { KnowledgeBase, WmAtom, conceptsOf, isConst, isHasSentence, isTruthy } from "./types.ts"
import { zip } from "../utils/zip.ts"
import { assert } from "../utils/assert.ts"
import { evaluate } from "./evaluate.ts"
import { uniq } from "../utils/uniq.ts"

export function defaultFillersOf(id: WmAtom, concept: WmAtom, kb: KnowledgeBase) {
  const parts = getParts(concept, kb)
  const defaults = parts.map(p => findDefault(p, concept, kb))
  const pds = zip(parts, defaults)

  const fillers = pds.flatMap(e => {
    const p = e[0]
    const d = e[1]
    if (d === undefined) return []
    if (typeof d === 'number' || typeof d === 'boolean') return evaluate($(id).has(d).as(p).tell.$, kb).additions

    return evaluate($(id).has(`x:${d}`).as(p).tell.$, kb).additions // wrong!
  })

  return fillers
}

function findDefault(part: WmAtom, concept: WmAtom, kb: KnowledgeBase): WmAtom | undefined {

  const result = evaluate($('x:thing').suchThat($(concept).has('x:thing').as(part)).$, kb).result
  if (result.type === 'nothing') return undefined
  assert(isConst(result))
  return result.value
}

function getParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

  const parts = kb.wm
    .filter(isHasSentence)
    .filter(x => x[0] === concept)
    .filter(x => isTruthy(evaluate($(x[1]).isa('number-restriction').isNotTheCase.$, kb).result))
    .filter(x => isTruthy(evaluate($(x[1]).isa('mutex-concepts-annotation').isNotTheCase.$, kb).result))
    .map(x => x[2])

  const supers = conceptsOf(concept, kb).filter(x => x !== concept)
  const all = supers.flatMap(x => getParts(x, kb)).concat(parts)
  return uniq(all)
}
