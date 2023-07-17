import { SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'
import { $ } from '../core/exp-builder.ts'

const astTypes = stringLiterals(
    'space',
    'identifier',
    'constant',
    'variable',
    'digits',
    'list-literal',
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
    'derivation-clause',
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
    'string',

    'whose-clause',
    'which-clause',

    'atom',
    'normal-atom',
    'parenthesized-expression',

)

const roles = stringLiterals(
    'id',
    'digits',
    'number',
    'varType',
    'seq',
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
    'recipient',
    'location',
    'object',

    'headType',
    'whose',
    'which',
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
        { types: ['identifier'], role: 'value' },
        { literals: [':'] },
        { types: ['identifier'], role: 'varType' },
    ],
    "list-literal": [
        { literals: ['['] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'value', number: '*', sep: 'space', defaultsTo: [] },
        { types: ['space'], number: '*' },
        { literals: [']'] },
    ],
    atom: [
        { types: ['parenthesized-expression', 'normal-atom'], expand: 'keep-specific-type' }
    ],
    "normal-atom": [
        { types: ['list-pattern', 'anaphor', 'list-literal', 'variable', 'constant',], expand: 'keep-specific-type' }
    ],
    'parenthesized-expression': [
        { literals: ['('] },
        { types: ['space'], number: '*' },
        { types: ['formula', 'atom'], expand: 'keep-specific-type' },
        { types: ['space'], number: '*' },
        { literals: [')'] },
    ],
    'list-pattern': [
        { types: ['variable', 'constant'], role: 'seq' },
        { literals: ['|'] },
        { types: ['variable', 'constant'], role: 'value' },
    ],
    equality: [
        { types: ['atom'], role: 't1', number: '1|0', defaultsTo: $._.$ },
        { types: ['space'], number: '*' },
        { literals: ['equals', 'equal', '='] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 't2', number: '1|0', defaultsTo: $._.$ },
    ],
    "is-a-formula": [
        { types: ['atom'], role: 't1', number: '1|0', defaultsTo: $._.$ },
        { types: ['space'], number: '*' },
        { literals: ['is'] },
        { types: ['space'], number: '+' },
        { literals: ['a'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 't2', number: '1|0', defaultsTo: $._.$ },
        { types: ['space'], number: '*' },
        { types: ['after-clause'], expand: true, number: '1|0', defaultsTo: { after: $([]).$ } },
    ],
    'after-clause': [
        { literals: ['after'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'after' },
    ],
    'has-formula': [
        { types: ['atom'], role: 't1', number: '1|0', defaultsTo: $._.$ },
        { types: ['space'], number: '*' },
        { literals: ['has'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 't2', number: '1|0', defaultsTo: $._.$ },
        { types: ['space'], number: '*' },
        { literals: ['as'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'as' },
        { types: ['space'], number: '*' },
        { types: ['after-clause'], expand: true, number: '1|0', defaultsTo: { after: $([]).$ } },
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
        { types: ['if-else', 'conjunction', 'derivation-clause', 'disjunction', 'existquant', 'math-expression', 'negation', 'simple-formula',], expand: 'keep-specific-type' } // order!
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
    'derivation-clause': [
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
        { types: ['atom'], role: 'left', number: '1|0' },
        { types: ['space'], number: '*' },
        { literals: ['+', '-', '*', '/', '>', '<'], role: 'operator' },
        { types: ['space'], number: '*' },
        { types: ['math-expression', 'atom'], role: 'right' },
    ],

    generalized: [
        { types: ['verb-sentence', 'annotation'], expand: true },
        { types: ['after-clause'], expand: true, number: '1|0', defaultsTo: { after: $([]).$ } },
    ],
    "verb-sentence": [
        { types: ['atom'], role: 'subject', number: '1|0', defaultsTo: $._.$ },
        { types: ['space'], number: '*' },
        { literals: ['does'] },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'verb' },
        { types: ['space'], number: '*' },
        { types: ['atom'], role: 'object', number: '1|0', defaultsTo: $._.$ },
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
        { types: ['digits'], role: 'number', number: '1|0', defaultsTo: 1 },
        { types: ['space'], number: '*' },
        { types: ['identifier'], role: 'headType' },
        { types: ['space'], number: '*' },
        { types: ['which-clause', 'whose-clause'], number: '1|0', expand: true },
        { types: ['space'], number: '*' },
        { types: ['complement'], number: '*', expand: true, sep: 'space' }, // sep space important
    ],
    'which-clause': [
        { literals: ['which'] },
        { types: ['space'], number: '*' },
        { types: ['simple-formula'], role: 'which' },
    ],
    'whose-clause': [
        { literals: ['whose'] },
        { types: ['space'], number: '*' },
        { types: ['simple-formula'], role: 'whose' },
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
    ],

}
