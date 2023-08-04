import { uniq } from "../utils/uniq.ts";
import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { WmAtom, KnowledgeBase, conceptsOf, isHasSentence, isTruthy } from "./types.ts";

export function getParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

    const supers = conceptsOf(concept, kb)

    const parts = kb.wm
        .filter(isHasSentence)
        .filter(x => x[0] === concept)
        .filter(x => isTruthy(ask($(x[1]).isa('number-restriction').isNotTheCase.$, kb).result))
        .filter(x => isTruthy(ask($(x[1]).isa('mutex-concepts-annotation').isNotTheCase.$, kb).result))
        .filter(x => isTruthy(ask($(x[1]).isa('mutex-annotation').isNotTheCase.$, kb).result))
        .map(x => x[2])

    const all = supers.filter(x => x !== concept).flatMap(x => getParts(x, kb)).concat(parts)
    return uniq(all)

}
