type IVarDeclaration = {
    type: 'variable-declaration'
    name: string
    // rval:    
}

type IFuncDefinition = {
    type: 'function-definition'
    name: string
    // block:
}

type ITypeDefinition = {
    type: 'type-definition'
    name: string
    // ...
}

type IVarReassignment = {
    type: 'variable-reassignment'
    name: string
    // rval:    
}

type IPropAssignment = {
    type: 'property-assignment'
    name: string
    variable: string
    // rval:    
}

type IFuncCall = {
    type: 'function-call'
    name: string
    // arguments:
}

type IWhileLoop = {
    type: 'while-loop'
    // condition:
    // block:
}

type IArithmeticExp = {
    type: 'arithmetic-expression'

}

type IComparisonExp = {
    type: 'comparison-expression'

}

type IConsCall = {
    type: 'constructor-call'

}

type IIfElse = {
    type: 'if-else'

}

type ISingleTask = {
    type: 'single-task'
}

type IRepeatedTask = {
    type: 'repeated-task'
}








