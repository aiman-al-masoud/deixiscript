import { LLangAst, isLLangAst } from "../core/types.ts";
import { valueIs } from "../utils/valueIs.ts";

export function hardLin(ast: LLangAst): string {

    switch (ast.type) {
        case "number":
        case "boolean":
        case "entity":
        case "nothing":
            return ast.value + ''
        case "variable":
            return ast.value + ':' + ast.varType
        case "list":
            return '[' + ast.value.map(x => hardLin(x)).reduce((a, b) => a + b + ' ', '').trim() + ']'
        case "conjunction":
            return hardLin(ast.f1) + ' and ' + hardLin(ast.f2)
        case "disjunction":
            return hardLin(ast.f1) + ' or ' + hardLin(ast.f2)
        case "negation":
            return 'not ( ' + hardLin(ast.f1) + ' )'
        case "existquant":
            return 'there is ' + hardLin(ast.value)
        case "when-derivation-clause":
            return hardLin(ast.conseq) + ' when ' + hardLin(ast.when)
        case "after-derivation-clause":
            return hardLin(ast.conseq) + ' after ' + hardLin(ast.after)
        case "if-else":
            return 'if ' + hardLin(ast.condition) + ' then ' + hardLin(ast.then) + ' else ' + hardLin(ast.otherwise)
        case "math-expression":
            return hardLin(ast.left) + ' ' + hardLin(ast.operator) + ' ' + hardLin(ast.right)
        case "arbitrary-type":
            return hardLin(ast.head) + ' such that ' + hardLin(ast.description)
        case "is-a-formula":
            return hardLin(ast.subject) + ' is a ' + hardLin(ast.object)
        case "has-formula":
            return hardLin(ast.subject) + ' has ' + hardLin(ast.object) + ' as ' + hardLin(ast.as)
        case "command":
            return hardLin(ast.f1) + '!'
        case "implicit-reference":
            return 'the ' + hardLin(ast.headType)
        case "which":
            return hardLin(ast.inner) + ' which ' + hardLin(ast.which)
        case "complement":
            throw new Error(``)
        case "generalized":
            const entries = Object.entries(ast).filter(valueIs(isLLangAst))
            const args = entries.map(e => e[0] + '=' + hardLin(e[1])).reduce((a, b) => a + b + ', ', '').trim()
            return '$(' + args + ')'
    }

}