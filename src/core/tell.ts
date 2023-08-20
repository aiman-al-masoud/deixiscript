import { $ } from "./exp-builder.ts";
import { subst } from "./subst.ts";
import { DerivationClause, KnowledgeBase, LLangAst, WorldModel, addWorldModels, isConst, isTruthy, subtractWorldModels } from "./types.ts";
import { consequencesOf } from "./consequencesOf.ts";
import { random } from "../utils/random.ts";
import { compareSpecificities } from "./compareSpecificities.ts";
import { sorted } from "../utils/sorted.ts";
import { assert } from "../utils/assert.ts";
import { evaluate } from "./evaluate.ts";
import { defaultFillersOf } from "./getDefaultFillers.ts";
import { excludedBy } from "./excludedBy.ts";


/**
 * Assumes the given AST is true, and compute resulting knowledge base.
 * Also provides WorldModel additions and elmininations (the "diff") 
 * to avoid having to recompute them.
 */
export function tell(
    ast: LLangAst,
    kb: KnowledgeBase,
): {
    kb: KnowledgeBase,
    additions: WorldModel,
    eliminations: WorldModel,
} {

    let additions: WorldModel = []
    let eliminations: WorldModel = []
    let addedDerivationClauses: DerivationClause[] = []

    switch (ast.type) {

        case 'has-formula':
            {
                assert(isConst(ast.subject) && isConst(ast.object) && isConst(ast.as))
                additions = [[ast.subject.value, ast.object.value, ast.as.value]]
            }
            break
        case 'is-a-formula':
            {
                assert(isConst(ast.subject) && isConst(ast.object))

                additions = addWorldModels(
                    [[ast.subject.value, ast.object.value]],
                    defaultFillersOf(ast.subject.value, ast.object.value, kb),
                )
            }
            break
        case 'conjunction':
            {
                const result1 = evaluate($(ast.f1).tell.$, kb)
                const result2 = evaluate($(ast.f2).tell.$, result1.kb)
                additions = addWorldModels(result1.additions, result2.additions)
                addedDerivationClauses = result2.kb.derivClauses
            }
            break
        case 'disjunction':
            throw new Error(`ambiguous disjunction`)
        case 'when-derivation-clause':
        case 'after-derivation-clause':
            addedDerivationClauses = [ast]
            break
        case 'if-else':
            {
                const { kb: kb1, result } = evaluate(ast.condition, kb)
                if (isTruthy(result)) return evaluate($(ast.then).tell.$, kb1)
                return evaluate($(ast.otherwise).tell.$, kb1)
            }
        case 'existquant':
            {
                const v = ast.value
                return evaluate($(v).tell.$, kb)
            }
        case 'arbitrary-type':
            {
                const id = ast.head.varType + '#' + random()
                const isa = $(id).isa(ast.head.varType)
                const where = subst(ast.description, [ast.head, $(id).$])
                const { kb: kb1 } = evaluate(isa.tell.$, kb)
                const result = evaluate($(where).tell.$, kb1)
                return result
            }
        case 'variable':
            {
                return evaluate($(ast).suchThat($(ast).isa(ast.varType)).tell.$, kb)
            }
        case 'negation':
            {
                const result = evaluate($(ast.f1).tell.$, kb)
                additions = result.eliminations
                eliminations = result.additions
            }
            break
        case 'generalized':
        case "complement":
        case 'cardinality':
        case 'which':
        case "number":
        case "boolean":
        case "entity":
        case "nothing":
        case "list":
        case "math-expression":
        case "implicit-reference":
        case "command":
        case "question":
            throw new Error(`not implemented`)
    }

    const consequences = consequencesOf(ast, kb)
    const consequencesWm = consequences.flatMap(x => evaluate($(x).tell.$, kb).additions)
    additions = [...additions, ...consequencesWm]

    eliminations = [
        ...eliminations,
        ...additions.flatMap(s => excludedBy(s, kb)),
    ]

    const wm0 = addWorldModels(kb.wm, additions)
    const wm = subtractWorldModels(wm0, eliminations)

    const derivClauses = sorted([...kb.derivClauses, ...addedDerivationClauses], (a, b) => compareSpecificities(b.conseq, a.conseq, kb))

    return {
        additions,
        eliminations,
        kb: {
            ...kb,
            wm,
            derivClauses,
        }
    }

}

