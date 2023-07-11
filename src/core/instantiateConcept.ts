import { random } from "../utils/random.ts";
import { $ } from "./exp-builder.ts";
import { tell } from "./tell.ts";
import { subst } from "./subst.ts";
import { ArbitraryType, KnowledgeBase, WorldModel, isHasSentence } from "./types.ts";
import { addWorldModels, subtractWorldModels } from "./wm-funcs.ts";


/**
 * Creates a new instance of a concept (an individual).
 * Returns the additions to the World Model ONLY.
 */
export function instantiateConcept(
    ast: ArbitraryType,
    kb: KnowledgeBase,
): WorldModel {

    const id = ast.head.varType + '#' + random()
    const where = subst(ast.description, [ast.head, $(id).$])

    const isAAdditions = tell($(id).isa(ast.head.varType).$, kb).additions
    const whereAdditions = tell(where, kb).additions

    const conflicts = isAAdditions
        .filter(isHasSentence)
        .filter(x => whereAdditions.some(y => y[0] === x[0] && y[2] === y[2]))

    const fillersWithoutConflicts = subtractWorldModels(
        isAAdditions,
        conflicts,
    )

    const additions = addWorldModels(
        fillersWithoutConflicts,
        whereAdditions,
    )

    return additions
}
