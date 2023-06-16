export type DeixiAst = Sentence | NaturalisticType

type Sentence =
    | SimpleSentence
    | CompoundSentence
    | ComplexSentence

type ComplexSentence =
    | IfSentence
    | MethodDefinition

type SimpleSentence =
    | DoSentence
    | IsSentence
    | IsASentence
    | HasSentence
    | ThereIsSentence
    | CompareSentence

type CompoundSentence =
    | AndSentence
    | OrSentence
    | NotSentence

type Reference = // aka: phrase
    | ImplicitReference
    | ExplicitReference
    | MultiReference
    | ConceptReference

type NaturalisticType =
    | ConceptType
    | PropertyType
    | ConditionType
    | NegationType
    | QuantifiedType

type Literal =
    | StringLiteral
    | NumberLiteral
    | BooleanLiteral

type MethodDefinition =
    | DeciderMethodDefinition
    | DoerMethodDefinition

type ConditionType = WhereType /* | WhichType | WhoseType | WithType */
type QuantifiedType = ExactQuantityType

type ExplicitReference =
    | IdReference
    | Literal
    | MathExpression

export type GrammaticalCase =
    | 'nominative'
    | 'accusative'
    | 'dative'
    | 'ablative'
    | 'genitive'

type ConceptReference = {
    type: 'concept-reference',
    ref: NaturalisticType,
}

type DoSentence = {
    type: 'do-sentence',
    verbName: string,
    parameters: { [x in GrammaticalCase]?: Reference },
}

type ImplicitReference = {
    type: 'implicit-reference',
    ref: NaturalisticType,
}

type MultiReference = {
    type: 'multi-reference',
    list: Reference[],
}

type ConceptType = {
    type: 'concept-type',
    name: string,
}

type PropertyType = {
    type: 'property-type',
    propName: string,
    inner: NaturalisticType,
}

type WhereType = {
    type: 'where-type',
    inner: NaturalisticType,
    where: Sentence,
}

type NegationType = {
    type: 'negation-type',
    inner: NaturalisticType,
}

type ExactQuantityType = {
    type: 'exact-quantity-type',
    quantity: number,
    inner: NaturalisticType,
}

type DoerMethodDefinition = {
    type: 'doer-method-definition',
    verbName: string,
    parameters: { [x in GrammaticalCase]?: Reference },
    body: Sentence,
}

type MathExpression = {
    type: 'math-expression',
    operator: '+' | '-' | '*' | '/',
    left: MathExpression | Reference,
    right: MathExpression | Reference,
}


//-------------------- LLANG CAN DO IT ---------------------------------------------
type IdReference = {
    type: 'explicit-reference',
    id: string,
}
type DeciderMethodDefinition = {
    type: 'decider-method-definition',
    consequence: Sentence,
    condition: Sentence,
}
type StringLiteral = {
    type: 'string-literal',
    value: string,
}
type NumberLiteral = {
    type: 'number-literal',
    value: number,
}
type BooleanLiteral = {
    type: 'boolean-literal',
    value: boolean,
}
type IsSentence = {
    type: 'is-sentence',
    first: Reference,
    second: Reference,
}
type IsASentence = {
    type: 'is-a-sentence',
    first: Reference,
    second: Reference,
}
type HasSentence = {
    type: 'has-sentence',
    first: Reference,
    second: Reference,
    role: Reference,
}
type ThereIsSentence = {
    type: 'there-is-sentence',
    subject: Reference,
}
type AndSentence = {
    type: 'and-sentence',
    first: Sentence,
    second: Sentence,
}
type OrSentence = {
    type: 'or-sentence',
    first: Sentence,
    second: Sentence,
}
type NotSentence = {
    type: 'not-sentence',
    first: Sentence,
}
type IfSentence = {
    type: 'if-sentence',
    first: Sentence,
    second: Sentence,
}
type CompareSentence = {
    type: 'compare-sentence',
    first: Reference,
    second: Reference,
    predicateName: string,
}
// ----------------------------------------------------------------------------------