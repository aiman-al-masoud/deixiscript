import { deepMapOf } from "../utils/DeepMap.ts";
import { random } from "../utils/random.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { substAll } from "./subst.ts";
import { ExistentialQuantification, KnowledgeBase, WmAtom, WorldModel, isHasSentence } from "./types.ts";
import { findAll } from "./findAll.ts";
import { addWorldModels, getParts, subtractWorldModels } from "./wm-funcs.ts";


/**
 * Uses default values to create a new instance of a concept.
 * Returns the additions to the World Model only.
 */
export function instantiateConcept(
    ast: ExistentialQuantification,
    kb: KnowledgeBase,
): WorldModel {

    const id = ast.variable.varType + '#' + random()
    const where = substAll(ast.where, deepMapOf([[ast.variable, $(id).$]]))

    const fillers =
        getDefaultFillers(id, ast.variable.varType, kb)

    const isAAdditions = tell($(id).isa(ast.variable.varType).$, kb).additions

    const whereAdditions = tell(where, kb).additions

    const conflicts = fillers
        .filter(isHasSentence)
        .filter(x => whereAdditions.some(y => y[0] === x[0] && y[2] === y[2]))

    const fillersWithoutConflicts = subtractWorldModels(fillers, conflicts)

    const additions = addWorldModels(
        isAAdditions,
        fillersWithoutConflicts,
        whereAdditions,
    )

    return additions
}

function getDefaultFillers(id: string, concept: string, kb: KnowledgeBase) {
    const parts = getParts(concept, kb.wm)
    const defaults = parts.map(p => findDefault(p, concept, kb))

    const fillers = defaults.flatMap((d, i) => {
        if (d === undefined) return []
        if (typeof d === 'number' || typeof d === 'boolean') return tell($(id).has(d).as(parts[i]).$, kb).additions
        return instantiateConcept($(`x:${d}`).exists.where($(id).has(`x:${d}`).as(parts[i])).$, kb)
    })

    return fillers
}

function findDefault(part: WmAtom, concept: WmAtom, kb: KnowledgeBase): WmAtom | undefined { //TODO: optimize
    const result = findAll(
        $({ annotation: 'x:thing', subject: part, owner: concept, verb: 'default', recipient: 'z:thing' }).$,
        [$('x:thing').$, $('z:thing').$],
        kb,
    )
    return result[0]?.get($('z:thing').$)?.value
}
