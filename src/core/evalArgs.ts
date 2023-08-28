import { valueIs } from "../utils/valueIs.ts"
import { evaluate } from "./evaluate.ts"
import { LLangAst, KnowledgeBase, isLLangAst, pointsToThings } from "./types.ts"


export function evalArgs<T extends LLangAst>(ast: T, kb: KnowledgeBase): { rast: T, kb: KnowledgeBase }
export function evalArgs(ast: LLangAst, kb: KnowledgeBase): { rast: LLangAst, kb: KnowledgeBase } {

  switch (ast.type) {
    case 'if-else':
    case 'conjunction':
    case 'disjunction':
    case 'variable':
    case 'number':
    case 'entity':
    case 'boolean':
    case 'list':
    case 'nothing':
    case 'negation':
    case 'existquant':
    case 'which':
    case 'arbitrary-type':
    case "when-derivation-clause":
    case "implicit-reference":
    case "after-derivation-clause":
    case "command":
      return { rast: ast, kb }
    case 'complement':
    case "is-a-formula":
    case "has-formula":
    case "math-expression":
    case "generalized":

      {
        const order = ['complementName', 'complement', 'phrase']
        const res = Object.entries(ast).filter(valueIs(isLLangAst)).sort((b, a) => order.indexOf(a[0]) - order.indexOf(b[0])).reduce((a, e) => {
          if (!pointsToThings(e[1])) return a
          const r = evaluate(e[1], a.kb)
          return { rast: { ...a.rast, [e[0]]: r.result }, kb: r.kb }
        }, { rast: ast, kb: kb })
        return res
      }

  }

}
