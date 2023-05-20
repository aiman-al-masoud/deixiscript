

type Expression = IArithmeticExp
    | IComparisonExp
    | IConsCallExp
    | IFuncCall
    | INumberExp
    | IStringExp

type Statement = IVarDeclaration
    | IFuncDefinition
    | IReturnStmnt
    | IVarReassignment
    | IPropAssignment
    | IWhileLoop
    | IIfElse
    | ITypeDefinition
    | ISingleTask
    | IRepeatedTask
    | IBlock

type IVarDeclaration = {
    type: 'variable-declaration'
    name: string
    rval: Expression
}

type IFuncDefinition = {
    type: 'function-definition'
    name: string
    parameters: string[]
    block: IBlock
}

type ITypeDefinition = {
    type: 'type-definition'
    name: string
    fields: IVarDeclaration[]
    constructor: IFuncDefinition
    methods: IFuncDefinition[]
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
    stopCondition: Expression
    block: IBlock
}

type IArithmeticExp = {
    type: 'arithmetic-expression'
    op: '+' | '-' | '*' | '/'
    left: Expression
    right: Expression
}

type IComparisonExp = {
    type: 'comparison-expression'
    comparator: '==' | '>' | '<' | '>=' | '<='
    left: Expression
    right: Expression
}

type IConsCallExp = {
    type: 'constructor-call'
    name: string
    arguments: Expression[]
}

type INumberExp = {
    type: 'number-expression'
    value: number
}

type IStringExp = {
    type: 'number-expression'
    value: string
}

type IIfElse = {
    type: 'if-else'
    condition: Expression
    then: IBlock
    otherwise: IBlock
}

type ISingleTask = {
    type: 'single-task'
    block: IBlock
}

type IRepeatedTask = {
    type: 'repeated-task'
    stopCondition: Expression
    block: IBlock
}

type IBlock = {
    type: 'block'
    statements: Statement[]
}

type IReturnStmnt = {
    type: 'return-statement'
    expression: Expression
}


