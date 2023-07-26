import { uniq } from "../utils/uniq.ts";
import { ask } from "./ask.ts";
import { $ } from "./exp-builder.ts";
import { WmAtom, KnowledgeBase, conceptsOf, isHasSentence } from "./types.ts";


export function getParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {
    const parts = getAllParts(concept, kb)
    return uniq(parts)
}

function getAllParts(concept: WmAtom, kb: KnowledgeBase): WmAtom[] {

    const supers = conceptsOf(concept, kb)

    const parts = kb.wm
        .filter(isHasSentence)
        .filter(x => x[0] === concept)
        .filter(x => ask($(x[1]).isa('only-one-annotation').isNotTheCase.$, kb).result.value)
        .filter(x => ask($(x[1]).isa('number-restriction').isNotTheCase.$, kb).result.value)
        .filter(x => ask($(x[1]).isa('mutex-concepts-annotation').isNotTheCase.$, kb).result.value)
        .filter(x => ask($(x[1]).isa('mutex-annotation').isNotTheCase.$, kb).result.value)
        .map(x => x[2])

    const all = supers.filter(x => x !== concept).flatMap(x => getAllParts(x, kb)).concat(parts)
    return uniq(all)

}
