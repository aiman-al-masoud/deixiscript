import { deepMapOf } from "../utils/DeepMap.ts";
import { random } from "../utils/random.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { substAll } from "./subst.ts";
import { ExistentialQuantification, KnowledgeBase, WmAtom, WorldModel } from "./types.ts";
import { findAll } from "./findAll.ts";
import { addWorldModels, getParts } from "./wm-funcs.ts";


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

    const parts = getParts(ast.variable.varType, kb.wm)
    const defaults = parts.map(p => findDefault(p, ast.variable.varType, kb))

    const fillers = defaults.flatMap((d, i) => {
        if (d === undefined) return []
        if (typeof d === 'number' || typeof d === 'boolean') return $(id).has(d).as(parts[i]).dump().additions
        return instantiateConcept($(`x:${d}`).exists.where($(id).has(`x:${d}`).as(parts[i])).$, kb)
    })

    const additions = addWorldModels(
        tell($(id).isa(ast.variable.varType).$, kb).additions,
        fillers,
        tell(where, kb).additions,
    )
    // TODO: in case where-clause and default fillers produce conflicting info, favor where-clause

    return additions
}

function findDefault(part: WmAtom, concept: WmAtom, kb: KnowledgeBase): WmAtom | undefined { //TODO: optimize
    const result = findAll(
        $({ annotation: 'x:thing', subject: part, owner: concept, verb: 'default', recipient: 'z:thing' }).$,
        [$('x:thing').$, $('z:thing').$],
        kb,
    )
    return result[0]?.get($('z:thing').$)?.value
}
