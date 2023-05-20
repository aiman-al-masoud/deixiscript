import { isRepeatable, SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'

export const astTypes = stringLiterals('copula-sentence', 'noun-phrase', 'number-literal', 'if-sentence')
const cstTypes = stringLiterals('saxon-genitive', 'of-genitive', 'sentence', 'space', 'identifier')
export const roles = stringLiterals('id', 'digits', 'subject', 'object', 'head', 'owner', 'modifiers', 'condition', 'consequence', 'negation')

export type AstType = ElementType<typeof astTypes>
export type StType = AstType | ElementType<typeof cstTypes>
export type Role = ElementType<typeof roles>

export const syntaxes: SyntaxMap<
    Role,
    StType
> = {
    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ':'], notEndWith: 's' }
    ],
    'number-literal': [
        { number: '+', role: 'digits', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    'noun-phrase': [
        { literals: ['the', 'a', 'an'], number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'modifiers', number: 'all-but-last', sep: 'space' },
        { types: ['space'], number: '1|0' },
        { types: ['saxon-genitive'], number: '1|0', expand: true },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'head' },
        { types: ['space'], number: '1|0' },
        { types: ['of-genitive'], number: '1|0', expand: true },
    ],
    'of-genitive': [
        { literals: ['of'] },
        { types: ['space'] },
        { types: ['noun-phrase'], role: 'owner' },
    ],
    'saxon-genitive': [
        { types: ['identifier'], role: 'owner' },
        { literals: ["'s"] },
    ],
    'copula-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['is', 'are', 'be'] },
        { types: ['space'], number: '1|0' },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object' },
    ],
    'if-sentence': [
        { literals: ['if'] },
        { types: ['space'], number: '1|0' },
        { types: ['sentence'], role: 'condition' },
        { types: ['space'], number: '1|0' },
        { literals: ['then'] },
        { types: ['space'], number: '1|0' },
        { types: ['sentence'], role: 'consequence' },
    ],
    'sentence': [
        { types: ['copula-sentence', 'if-sentence'], expand: 'keep-specific-type' }
    ]
}


export type AstNode = NounPhrase | Sentence
export type Sentence = CopulaSentence | IfSentence

export type NounPhrase = {
    type: 'noun-phrase'
    modifiers: string[]
    head: string
    owner?: NounPhrase | string
}

export type CopulaSentence = {
    type: 'copula-sentence'
    subject: NounPhrase
    negation?: string
    object: NounPhrase
}

export type IfSentence = {
    type: 'if-sentence'
    condition: Sentence
    consequence: Sentence
}


type TypeDesc = { /* optional:boolean, */ many: boolean, types: string[] }

function generateAstType(syntaxName: string, syntaxes: SyntaxMap, ast: { [role: string]: TypeDesc } = {}) {

    syntaxes[syntaxName].forEach(m => {

        if (m.role && m.types) {

            if (!ast[m.role]) {
                ast[m.role] = { many: isRepeatable(m.number), types: [] }
            }

            m.types.forEach(t => {
                const isString = syntaxes[t].length === 1 && syntaxes[t][0].reduce
                ast[m.role!].types.push(isString ? 'string' : t)
            })

        }

        if (m.expand && m.types) {
            m.types.forEach(x => generateAstType(x, syntaxes, ast))
        }

    })

    return ast
}


// console.log(generateAstType('noun-phrase', syntaxes))
// console.log(generateAstType('copula-sentence', syntaxes))
// console.log(generateAstType('if-sentence', syntaxes))

function toTsType(td: TypeDesc) {

    // console.log(td)

    const taggedUnion = td.types.map(x => x.replace('-', '_')).reduce((a, b) => a + ' | ' + b)

    if (td.many && td.types.length > 1) {
        return `(${taggedUnion})[]`
    }

    if (td.many && td.types.length === 1) {
        return `${taggedUnion}[]`
    }


    return taggedUnion

}

function toTsTypeFull(t: { [role: string]: TypeDesc }) {

    const x = Object.entries(t).map(e => `${e[0]} : ${toTsType(e[1])};`).reduce((a, b) => a + '\n' + b, '')
    return `{
        ${x}
    }`
}

astTypes.forEach(t => {
    console.log('---', t, '---')
    console.log(toTsTypeFull(generateAstType(t, syntaxes)))
})
