import { SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'

const astTypes = stringLiterals(
    'space',
    'identifier',
    'constant',
    'variable',
    'digits',
    'list-literal',
    'atom',
    'list-pattern',
    'equality',
    'is-a-formula',
    'has-formula',
    'after-clause',
    'simple-formula',
    'word',
    'entity',
    'number',
    'boolean',
    'conjunction',
    'formula',
    'disjunction',
    'negation',
    'existquant',
    'derived-prop',
    'if-else',
    'math-expression',
    'happen-sentence',
    'generalized',
    'anaphor',
    'command',
    'question',
    'verb-sentence',
    'annotation',
    'dative-to',
    'locative-in',
    'complement',
    'anaphor-description',
    'string',
)

const roles = stringLiterals(
    'id',
    'digits',
    'name',
    'number',
    'varType',
    'list',
    'seq',
    'tail',
    't1',
    't2',
    'after',
    'as',
    'value',
    'f1',
    'f2',
    'variable',
    'where',
    'conseq',
    'when',
    'condition',
    'then',
    'otherwise',
    'left',
    'right',
    'operator',
    'event',
    'subject',
    'verb',
    'head',
    'description',
    'annotation',
    'keys',
    'recipient',
    'location',
    'object',
)

type StType = ElementType<typeof astTypes>
type Role = ElementType<typeof roles>

export const syntaxes: SyntaxMap<
    Role,
    StType
> = {

    word: [
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',] }
    ],
    digits: [
        { number: '+', role: 'id', reduce: 'to-number', literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { types: ['word'], expand: true, reduce: true }
    ],
    constant: [
        { types: ['entity', 'number', 'boolean'], expand: 'keep-specific-type' }
    ],
    number: [
        { types: ['digits'], role: 'value' },
    ],
    entity: [
        { types: ['identifier'], role: 'value' },
    ],
    boolean: [
        { literals: ['true', 'false'], role: 'value', isBool: 'true' }
    ],
    string: [
        { literals: ['"'] },
        { literals: [], anyCharExceptFor: ['"'], number: '*', role: 'value', reduce: true },
        { literals: ['"'] },
    ],
    variable: [
        { types: ['identifier'], role: 'name' },
        { literals: [':'] },
        { types: ['identifier'], role: 'varType' },
    ],
    "list-literal": [
        { literals: ['['] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'list', number: '*', sep: 'space' },
        { types: ['space'], number: '*' },
        { literals: [']'] },
    ],
    atom: [
        { types: ['list-pattern', 'anaphor', 'list-literal', 'variable', 'constant',], expand: 'keep-specific-type' }
    ],
    'list-pattern': [
        { types: ['variable', 'constant'], role: 'seq' },
        { literals: ['|'] },
        { types: ['variable', 'constant'], role: 'tail' },
    ],
    equality: [
        { types: ['atom'], role: 't1' },
        { types: ['space'], number: '*' },
        { literals: ['equals', 'equal', '='] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 't2' },
    ],
    "is-a-formula": [
        { types: ['atom'], role: 't1' },
        { types: ['space'], number: '*' },
        { literals: ['is'] },
        { types: ['space'], number: '+' },
        { literals: ['a'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 't2' },
        { types: ['space'], number: '*' },
        { types: ['after-clause'], expand: true, number: '1|0' },
    ],
    'after-clause': [
        { literals: ['after'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'after' },
    ],
    'has-formula': [
        { types: ['atom'], role: 't1' },
        { types: ['space'], number: '*' },
        { literals: ['has'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 't2' },
        { types: ['space'], number: '*' },
        { literals: ['as'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'as' },
        { types: ['space'], number: '*' },
        { types: ['after-clause'], expand: true, number: '1|0' },
    ],
    'happen-sentence': [
        { types: ['entity'], role: 'event' },
        { types: ['space'], number: '*' },
        { literals: ['happens'] },
    ],
    'simple-formula': [
        { types: ['generalized', 'is-a-formula', 'equality', 'has-formula', 'happen-sentence'], expand: 'keep-specific-type' } // order: "is a" before "is"
    ],
    conjunction: [
        { types: ['simple-formula'], role: 'f1' },
        { types: ['space'], number: '*' },
        { literals: ['and'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'f2' },
    ],
    formula: [
        { types: ['if-else', 'conjunction', 'derived-prop', 'disjunction', 'existquant', 'negation', 'simple-formula',], expand: 'keep-specific-type' } // order!
    ],
    disjunction: [
        { types: ['simple-formula'], role: 'f1' },
        { types: ['space'], number: '*' },
        { literals: ['or'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'f2' },
    ],
    negation: [
        { literals: ['it is not the case that'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'f1' },
    ],
    existquant: [
        { literals: ['there exists a'] },
        { types: ['space'], number: '*' },
        { types: ['variable'], role: 'variable' },
        { types: ['space'], number: '*' },
        { literals: ['where'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'where' },
    ],
    'derived-prop': [
        { types: ['simple-formula'], role: 'conseq' },
        { types: ['space'], number: '*' },
        { literals: ['when'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'when' },
    ],
    'if-else': [
        { literals: ['if'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'condition' },
        { types: ['space'], number: '*' },
        { literals: ['then'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'then' },
        { types: ['space'], number: '*' },
        { literals: ['else'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'otherwise' },
    ],
    'math-expression': [
        { types: ['atom'], role: 'left' },
        { types: ['space'], number: '*' },
        { literals: ['+', '-', '*', '/', '>', '<'], role: 'operator' },
        { types: ['space'], number: '*' },
        { types: ['atom', 'math-expression'], role: 'right' },
    ],
    generalized: [
        { types: ['verb-sentence', 'annotation'], role: 'keys' },
        { types: ['after-clause'], expand: true, number: '1|0' },
    ],
    "verb-sentence": [
        { types: ['atom'], role: 'subject' },
        { types: ['space'], number: '*' },
        { literals: ['does'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'verb' },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'object', number: '1|0' },
        { types: ['space'], number: '*' },
        { types: ['complement'], number: '*', expand: true, sep: 'space' }, // sep space important
    ],
    annotation: [
        { types: ['atom'], role: 'annotation' },
        { types: ['space'], number: '*' },
        { literals: [':'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], expand: true },
    ],
    anaphor: [
        { literals: ['the'] },
        { types: ['space'], number: '*' },
        { types: ['variable'], role: 'head' },
        { types: ['space'], number: '*' },
        { types: ['anaphor-description'], number: '*', expand: true },
    ],
    'anaphor-description': [
        { literals: ['such that'] },
        { types: ['space'], number: '*' },
        { types: ['formula'], role: 'description' },
    ],
    command: [
        { types: ['formula'], role: 'f1' },
        { types: ['space'], number: '*' },
        { literals: ['!'] }
    ],
    question: [
        { types: ['formula', 'atom'], role: 'f1' },
        { types: ['space'], number: '*' },
        { literals: ['?'] }
    ],
    "locative-in": [
        { literals: ['in'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'location' },
    ],
    'dative-to': [
        { literals: ['to'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'recipient' },
    ],
    complement: [
        { types: ['locative-in', 'dative-to'], expand: true, sep: 'space' }
    ]
}
