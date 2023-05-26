import { SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'
import { generateTypes } from '../parser/generate-types.ts'

const astTypes = stringLiterals('copula-sentence', 'noun-phrase', 'number-literal', 'verb-sentence', 'if-sentence', 'comparative-sentence', 'has-sentence', 'and-sentence')
const cstTypes = stringLiterals('saxon-genitive', 'of-genitive', 'sentence', 'space', 'identifier')
const roles = stringLiterals('id', 'digits', 'subject', 'object', 'head', 'owner', 'modifiers', 'condition', 'consequence', 'negation', 'verb', 'comparison', 'role', 'pluralizer', 'first', 'second',)

type AstType = ElementType<typeof astTypes>
type StType = AstType | ElementType<typeof cstTypes>
type Role = ElementType<typeof roles>

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
        { literals: ['s'], number: '1|0', role: 'pluralizer' },
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
    'verb-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['does', 'do'] },
        { types: ['space'], number: '1|0' },
        { literals: ['not'], role: 'negation', number: '1|0' },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'verb' },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object', number: '1|0' },
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
        { types: ['copula-sentence', 'if-sentence', 'verb-sentence', 'comparative-sentence', 'has-sentence'], expand: 'keep-specific-type' }
    ],
    'comparative-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['is', 'are', 'be'] },
        { types: ['space'], number: '1|0' },
        { literals: ['more'] },
        { types: ['space'], number: '1|0' },
        { types: ['identifier'], role: 'comparison' },
        { types: ['space'], number: '1|0' },
        { literals: ['than'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object' },
    ],
    'has-sentence': [
        { types: ['noun-phrase'], role: 'subject' },
        { types: ['space'], number: '1|0' },
        { literals: ['has', 'have'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'object' },
        { types: ['space'], number: '1|0' },
        { literals: ['as'] },
        { types: ['space'], number: '1|0' },
        { types: ['noun-phrase'], role: 'role' },
    ],
    'and-sentence': [
        { types: ['sentence'], role: 'first' },
        { types: ['space'], number: '1|0' },
        { literals: ['and'] },
        { types: ['space'], number: '1|0' },
        { types: ['sentence', 'and-sentence'], role: 'second' },
    ]

}


/**
 * REMEMBER to re-run this file whenever you edit the syntaxes, so as 
 * to update the typescript AST types.
 */
if (import.meta.main) {
    console.log(generateTypes([...astTypes, 'sentence'], syntaxes))
}