import { SyntaxMap } from '../parser/types.ts'
import { stringLiterals } from '../utils/stringLiterals.ts'
import { ElementType } from '../utils/ElementType.ts'
import { getParser } from '../parser/parser.ts'

const astTypes = stringLiterals(
    'space',
    'identifier',
    'constant',
    'variable',
    'number',
    'list-literal',
    'atom',
    'list-pattern',
    'equality',
    'is-a-formula',
    'has-formula',
    'after-clause',
    'simple-formula',
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
)

type StType = ElementType<typeof astTypes>
type Role = ElementType<typeof roles>

export const syntaxes: SyntaxMap<
    Role,
    StType
> = {
    space: [
        { number: '+', literals: [' ', '\n', '\t'] }
    ],
    identifier: [
        { number: '+', role: 'id', reduce: true, literals: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',] }
    ],
    number: [
        { number: '+', role: 'id', reduce: true, literals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] }
    ],
    constant: [
        { types: ['identifier'], role: 'name' },
        { literals: ['#'] },
        { types: ['number'], role: 'number' },
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
        { literals: ['is a'] },
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
    'simple-formula': [
        { types: ['equality', 'is-a-formula', 'has-formula'], expand: 'keep-specific-type' }
    ]
}

const parser = getParser({ sourceCode: 'x:capra capra#1  [x:capra y:capra capra#1 ] x:seq|e:event  capra#1 is capra#1  x:scemo is a capra#0 after [event#1]   x:capra has stupidity#0 as intelligence#1', syntaxes })

const result = parser.parse()
console.log(result)
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
