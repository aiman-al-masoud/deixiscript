export type IAst = IExpression | IStatement

type IExpression = IArithmeticExp
    | IComparisonExp
    | IConsCallExp
    | IFuncCall
    | INumberExp
    | IStringExp
    | IPropReadExp

type IStatement = IVarDeclaration
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
    rval: IExpression
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
    rval: IExpression
}

type IPropAssignment = {
    type: 'property-assignment'
    name: string
    variable: string
    rval: IExpression
}

type IFuncCall = {
    type: 'function-call'
    name: string
    arguments: IExpression[]
}

type IWhileLoop = {
    type: 'while-loop'
    stopCondition: IExpression
    block: IBlock
}

type IArithmeticExp = {
    type: 'arithmetic-expression'
    op: '+' | '-' | '*' | '/'
    left: IExpression
    right: IExpression
}

type IPropReadExp = {
    type: 'property-read',
    name:string,
    variable:string,
}

type IComparisonExp = {
    type: 'comparison-expression'
    comparator: '==' | '>' | '<' | '>=' | '<='
    left: IExpression
    right: IExpression
}

type IConsCallExp = {
    type: 'constructor-call'
    name: string
    arguments: IExpression[]
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
    condition: IExpression
    then: IBlock
    otherwise: IBlock
}

type ISingleTask = {
    type: 'single-task'
    block: IBlock
}

type IRepeatedTask = {
    type: 'repeated-task'
    stopCondition: IExpression
    block: IBlock
}

type IBlock = {
    type: 'block'
    statements: IStatement[]
}

type IReturnStmnt = {
    type: 'return-statement'
    expression: IExpression
}


