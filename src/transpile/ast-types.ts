
    type copula_sentence = {
        type : 'copula-sentence'
        subject: noun_phrase
	negation?: string
	object: noun_phrase
    }
    


    export type noun_phrase = {
        type : 'noun-phrase'
        modifiers?: string[]
	owner?: noun_phrase | string
	head: string
    }
    


    type number_literal = {
        type : 'number-literal'
        digits: string[]
    }
    


    type if_sentence = {
        type : 'if-sentence'
        condition: sentence
	consequence: sentence
    }
    

type sentence = copula_sentence|if_sentence

export type ast_node = copula_sentence|noun_phrase|number_literal|if_sentence|sentence
