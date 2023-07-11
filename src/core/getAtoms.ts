import { Atom, LLangAst } from "./types.ts"

export function getAtoms(ast: LLangAst): Atom[] {
    switch (ast.type) {
        case 'if-else':
            return getAtoms(ast.condition).concat(getAtoms(ast.otherwise)).concat(getAtoms(ast.then))
        case 'derived-prop':
            return getAtoms(ast.conseq).concat(getAtoms(ast.when))
        case 'disjunction':
        case 'conjunction':
            return getAtoms(ast.f1).concat(getAtoms(ast.f2))
        case 'negation':
            return getAtoms(ast.f1)
        case 'has-formula':
            return getAtoms(ast.t1).concat(getAtoms(ast.t2)).concat(getAtoms(ast.as)).concat(getAtoms(ast.after))
        case 'is-a-formula':
            return getAtoms(ast.t1).concat(getAtoms(ast.t2)).concat(getAtoms(ast.after))
        case 'equality':
            return getAtoms(ast.t1).concat(getAtoms(ast.t2))
        case 'math-expression':
            return [ast.left, ...getAtoms(ast.right)]
        case 'existquant':
            return getAtoms(ast.value)
        case 'list-literal':
            return ast.value.flatMap(x => getAtoms(x))
        case 'list-pattern':
            return [ast.seq, ast.value]
        case 'arbitrary-type':
            return [ast.head, ...getAtoms(ast.description)]
        case 'entity':
        case 'variable':
        case 'boolean':
        case 'number':
            return [ast]
    }

    throw new Error('not implemented: ' + ast.type)
}
