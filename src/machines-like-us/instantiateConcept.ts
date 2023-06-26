import { deepMapOf } from "../utils/DeepMap.ts";
import { random } from "../utils/random.ts";
import { $ } from "./exp-builder.ts";
import { recomputeKb } from "./recomputeKb.ts";
import { substAll } from "./subst.ts";
import { ExistentialQuantification, KnowledgeBase, WorldModel } from "./types.ts";


/**
 * Uses default values to create a new instance of a concept.
 */
export function instantiateConcept(
    ast: ExistentialQuantification,
    kb: KnowledgeBase,
): WorldModel {

    const id = ast.variable.varType + '#' + random()
    const where = substAll(ast.where, deepMapOf([[ast.variable, $(id).$]]))

    const additions: WorldModel = [
        [id, ast.variable.varType],
        ...recomputeKb(where, kb).kb.wm,
    ]

    return additions
}

