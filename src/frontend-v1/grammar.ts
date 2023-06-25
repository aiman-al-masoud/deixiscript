import { SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'
import { getParser } from '../parser/parser.ts'

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
        { number: '+', role: 'id', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
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
        { literals: ['true', 'false'], role: 'value' }
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
        { types: ['list-pattern', 'list-literal', 'variable', 'constant',], expand: 'keep-specific-type' }
    ],
    'list-pattern': [
        { types: ['variable', 'constant'], role: 'seq' },
        { literals: ['|'] },
        { types: ['variable', 'constant'], role: 'tail' },
    ],
    equality: [
        { types: ['atom'], role: 't1' },
        { types: ['space'], number: '*' },
        { literals: ['is'] },
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
        { types: ['is-a-formula', 'equality', 'has-formula', 'happen-sentence'], expand: 'keep-specific-type' } // order: "is a" before "is"
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
        { literals: ['+', '-', '*', '/'], role: 'operator' },
        { types: ['space'], number: '*' },
        { types: ['atom', 'math-expression'], role: 'right' },
    ]

}

const parser = getParser({ sourceCode: 'x:capra capraxy  [x:capra y:capra capraxy ] x:seq|e:event  capraxy is capraxy  x:scemo is a capra x:capra has 0 as intelligence after [eventxy]  true   x is capra and y is buruf and z is scemo   it is not the case that x is y   there exists a x:cat where x:cat has red as color   x:cat is red when x:cat has red as color  if x is capra then x is stupid else x is smart  1 + x:capra  eventxy happens', syntaxes })

console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())
console.log(parser.parse())





