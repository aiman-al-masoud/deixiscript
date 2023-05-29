export type JsAst = JsExpression | JsStatement

type JsExpression = JsArithmeticExp
    | JsComparisonExp
    | JsConsCallExp
    | JsFuncCall
    | JsNumberExp
    | JsStringExp
    | JsPropReadExp

type JsStatement = JsVarDeclaration
    | JsFuncDefinition
    | JsReturnStmnt
    | JsVarReassignment
    | JsPropAssignment
    | JsWhileLoop
    | JsJsfElse
    | JsTypeDefinition
    | JsSingleTask
    | JsRepeatedTask
    | JsBlock

type JsVarDeclaration = {
    type: 'variable-declaration'
    name: string
    rval: JsExpression
}

type JsFuncDefinition = {
    type: 'function-definition'
    name: string
    parameters: string[]
    block: JsBlock
}

type JsTypeDefinition = {
    type: 'type-definition'
    name: string
    fields: JsVarDeclaration[]
    constructor: JsFuncDefinition
    methods: JsFuncDefinition[]
}

type JsVarReassignment = {
    type: 'variable-reassignment'
    name: string
    rval: JsExpression
}

type JsPropAssignment = {
    type: 'property-assignment'
    name: string
    variable: string
    rval: JsExpression
}

type JsFuncCall = {
    type: 'function-call'
    name: string
    arguments: JsExpression[]
}

type JsWhileLoop = {
    type: 'while-loop'
    stopCondition: JsExpression
    block: JsBlock
}

type JsArithmeticExp = {
    type: 'arithmetic-expression'
    op: '+' | '-' | '*' | '/'
    left: JsExpression
    right: JsExpression
}

type JsPropReadExp = {
    type: 'property-read',
    name: string,
    variable: string,
}

type JsComparisonExp = {
    type: 'comparison-expression'
    comparator: '==' | '>' | '<' | '>=' | '<='
    left: JsExpression
    right: JsExpression
}

type JsConsCallExp = {
    type: 'constructor-call'
    name: string
    arguments: JsExpression[]
}

type JsNumberExp = {
    type: 'number-expression'
    value: number
}

type JsStringExp = {
    type: 'string-expression'
    value: string
}

type JsJsfElse = {
    type: 'if-else'
    condition: JsExpression
    then: JsBlock
    otherwise: JsBlock
}

type JsSingleTask = {
    type: 'single-task'
    block: JsBlock
}

type JsRepeatedTask = {
    type: 'repeated-task'
    stopCondition: JsExpression
    block: JsBlock
}

type JsBlock = {
    type: 'block'
    statements: JsStatement[]
}

type JsReturnStmnt = {
    type: 'return-statement'
    expression: JsExpression
}


