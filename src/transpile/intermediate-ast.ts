

type Expression = IArithmeticExp | IComparisonExp | IConsCallExp | IFuncCall

type Statement = IVarDeclaration
    | IFuncDefinition
    | ReturnStmnt
    | IVarReassignment
    | IPropAssignment
    | IWhileLoop
    | IIfElse
    | ITypeDefinition
    | ISingleTask
    | IRepeatedTask
    | Block

type IVarDeclaration = {
    type: 'variable-declaration'
    name: string
    rval: Expression
}

type IFuncDefinition = {
    type: 'function-definition'
    name: string
    parameters: string[]
    block: Block
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
    block: Block
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

type IIfElse = {
    type: 'if-else'
    condition: Expression
    then: Block
    otherwise: Block
}

type ISingleTask = {
    type: 'single-task'
    block: Block
}

type IRepeatedTask = {
    type: 'repeated-task'
    stopCondition: Expression
    block: Block
}

type Block = {
    type: 'block'
    statements: Statement[]
}

type ReturnStmnt = {
    type: 'return-statement'
    expression: Expression
}


