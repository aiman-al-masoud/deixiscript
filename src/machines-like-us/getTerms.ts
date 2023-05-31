import { Atom, LLangAst, Term } from "./types.ts";

export function getTerms(ast: LLangAst): Atom[] {
    switch (ast.type) {
        case 'if-else':
            return getTerms(ast.condition).concat(getTerms(ast.otherwise)).concat(getTerms(ast.then))
        case 'derived-prop':
            return getTerms(ast.conseq).concat(getTerms(ast.when))
        case 'disjunction':
        case 'conjunction':
            return getTerms(ast.f1).concat(getTerms(ast.f2))
        case 'negation':
            return getTerms(ast.f1)
        case 'has-formula':
            return getTerms(ast.t1).concat(getTerms(ast.t2)).concat(getTerms(ast.as)).concat(getTerms(ast.after))
        case 'is-a-formula':
            return getTerms(ast.t1).concat(getTerms(ast.t2)).concat(getTerms(ast.after))
        case 'equality':
            return getTerms(ast.t1).concat(getTerms(ast.t2))
        case 'existquant':
            return [ast.variable, ...getTerms(ast.where)]
        case 'list-literal':
            // return ast.list.flatMap(x => getTerms(x))
            return [ast]
        case 'list-pattern':
            // return [ast.seq, ast.tail]
            return [ast]
        case 'constant':
        case 'variable':
        case 'boolean':
            return [ast]
    }
}

// import { $ } from "./exp-builder.ts";
// const x = $('x:thing').isa('y').after('s:thing|e:thing').$
// console.log(getTerms(x))
