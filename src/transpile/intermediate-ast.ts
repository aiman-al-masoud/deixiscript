type Expression = IArithmeticExp | IComparisonExp | IConsCallExp

type IVarDeclaration = {
    type: 'variable-declaration'
    name: string
    rval: Expression
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
    rval: Expression
}

type IPropAssignment = {
    type: 'property-assignment'
    name: string
    variable: string
    rval: Expression
}

type IFuncCall = {
    type: 'function-call'
    name: string
    arguments: Expression[]
}

type IWhileLoop = {
    type: 'while-loop'
    endCondition: Expression
    // block:
}

type IArithmeticExp = {
    type: 'arithmetic-expression'

}

type IComparisonExp = {
    type: 'comparison-expression'

}

type IConsCallExp = {
    type: 'constructor-call'

}

type IIfElse = {
    type: 'if-else'
    condition: Expression
    // then:
    // otherwise:
}

type ISingleTask = {
    type: 'single-task'
}

type IRepeatedTask = {
    type: 'repeated-task'
}








