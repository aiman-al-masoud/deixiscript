
export type copula_sentence = {
    type: 'copula-sentence'
    subject: noun_phrase
    negation?: string
    object: noun_phrase
    receiver?: noun_phrase
    location?: noun_phrase
}



export type noun_phrase = {
    type: 'noun-phrase'
    modifiers?: string[]
    owner?: noun_phrase | string
    head: string
    pluralizer?: string
    suchThat?: sentence
}



export type number_literal = {
    type: 'number-literal'
    digits: string[]
}



export type verb_sentence = {
    type: 'verb-sentence'
    subject: noun_phrase
    negation?: string
    verb: string
    object?: noun_phrase
    receiver?: noun_phrase
    location?: noun_phrase
}



export type if_sentence = {
    type: 'if-sentence'
    condition: sentence
    consequence: sentence
}



export type comparative_sentence = {
    type: 'comparative-sentence'
    subject: noun_phrase
    comparison: string
    object: noun_phrase
}



export type has_sentence = {
    type: 'has-sentence'
    subject: noun_phrase
    object: noun_phrase
    role: noun_phrase
}



export type and_sentence = {
    type: 'and-sentence'
    first: sentence
    second: sentence | and_sentence
}



export type there_is_sentence = {
    type: 'there-is-sentence'
    subject: noun_phrase
}


export type sentence = copula_sentence | if_sentence | verb_sentence | comparative_sentence | has_sentence

export type ast_node = copula_sentence | noun_phrase | number_literal | verb_sentence | if_sentence | comparative_sentence | has_sentence | and_sentence | there_is_sentence | sentence