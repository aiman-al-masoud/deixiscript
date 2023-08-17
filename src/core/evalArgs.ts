import { valueIs } from "../utils/valueIs.ts"
import { evaluate } from "./evaluate.ts"
import { LLangAst, KnowledgeBase, isLLangAst, pointsToThings } from "./types.ts"


export function evalArgs<T extends LLangAst>(ast: T, kb: KnowledgeBase): { rast: T, kb: KnowledgeBase }
export function evalArgs(ast: LLangAst, kb: KnowledgeBase) {

  switch (ast.type) {

    case 'complement':
      {
        // const { result: complementName, kb: kb1 } = evaluate(ast.complementName, kb)
        const { result: complement, kb: kb2 } = evaluate(ast.complement, kb /* kb1 */)
        const rast = { ...ast, complement, /* complementName */ }
        return { rast, kb: kb2 }
      }
    case 'if-else':
    case 'cardinality':
    case 'which':
    case 'conjunction':
    case 'disjunction':
    case 'existquant':
    case 'negation':
    case 'variable':
    case 'number':
    case 'entity':
    case 'boolean':
    case 'arbitrary-type':
    case 'list':
    case 'nothing':
      return { rast: ast, kb }

    default:
      {

        const res = Object.entries(ast).filter(valueIs(isLLangAst)).reduce((a, e) => {
          if (!pointsToThings(e[1])) return a
          const r = evaluate(e[1], a.kb)
          return { rast: { ...a.rast, [e[0]]: r.result }, kb: r.kb }
        }, { rast: ast, kb: kb })
        return res
      }
  }

}
