// import { $ } from '../machines-like-us/exp-builder.ts'
// import { WorldModel } from '../machines-like-us/types.ts'
// import { getParts } from '../machines-like-us/wm-funcs.ts'
// import { findAll } from '../machines-like-us/findAll.ts'

// const model: WorldModel = [

//     ['number', 'thing'],
//     ['event', 'thing'],
//     ['change-event', 'event'],
//     ['mouse-click-event', 'event'],
//     ['key-press-event', 'event'],
//     ['key', 'thing'],
//     ['drawable', 'thing'],
//     ['text-field', 'drawable'],
//     ['button', 'drawable'],
//     ['image', 'drawable'],
//     ['color', 'thing'],
//     ['sound', 'thing'],

//     ['drawable', 'length', 'part'],
//     ['drawable', 'width', 'part'],
//     ['drawable', 'location', 'part'],
//     ['drawable', 'background-color', 'part'],

//     ['vr#1', 'value-restriction'],
//     ['vr#1', 'length', 'subject'],
//     ['vr#1', 'number', 'object'],

//     ['vr#2', 'value-restriction'],
//     ['vr#2', 'width', 'subject'],
//     ['vr#2', 'number', 'object'],

//     ['vr#3', 'value-restriction'],
//     ['vr#3', 'location', 'subject'],
//     ['vr#3', 'drawable', 'object'],

//     ['event', 'location', 'part'],
//     ['event', 'time', 'part'],

//     ['vr#4', 'value-restriction'],
//     ['vr#4', 'time', 'subject'],
//     ['vr#4', 'number', 'object'],

//     ['vr#5', 'value-restriction'],
//     ['vr#5', 'background-color', 'subject'],
//     ['vr#5', 'color', 'object'],

// ]

// // $('vr#5').isa('value-restriction');
// // $('vr#5').has('background-color').as('subject');
// // $('vr#5').has('color').as('object');
// // const ps = getParts('drawable', model)
// // console.log(ps)

// // function findPartType(concept:string, part:string, model:WorldModel){

// //     if(!getParts(concept, model).includes(part)){
// //         throw new Error(`${concept} does not have ${part} as a part!`)
// //     }

// //     $('vr:value-restriction')

// // }



// const vr = $('vr:value-restriction')
// const x = $('x:thing')

// const query = vr.isa('value-restriction')
//     .and(vr.has('location').as('subject'))
//     .and(vr.has(x).as('object'))
//     .$

// const kb = { wm: model, derivClauses: [] }

// console.log(findAll(query, [vr.$, x.$], kb))




// // const model = [
// //     $('event').isa('thing'),
// //     $('change-event').isa('event'),
// //     $('key-press-event').isa('event'),
// //     $('key').isa('thing'),
// //     $('mouse-click-event').isa('event'),
// //     $('drawable').isa('thing'),
// //     $('text-field').isa('drawable'),
// //     $('button').isa('drawable'),
// //     $('image').isa('drawable'),
// //     $('color').isa('thing'),
// //     $('sound').isa('thing'),
// // ]


import { $ } from '../machines-like-us/exp-builder.ts'
import { WorldModel } from '../machines-like-us/types.ts'
import { findAll } from '../machines-like-us/findAll.ts'
import { ast_node } from './ast-types.ts'
import { parse } from './parse.ts'
import { wm } from './example-world-model.ts'

// const wm: WorldModel = [
//     ['background', 'thing'],
//     ['button', 'thing'],
//     ['color', 'thing'],
//     ['button', 'color', 'background'],
//     ['red', 'color'],
//     // ['foreground', 'thing'],
//     // ['button', 'color', 'foreground'],
// ]

// the red button --> button with red BACKGROUND ...
// what are the s superconcept and r role such that "red" is an s AND button has s as r
const query = $('red').isa('s:thing').and($('button').has('s:thing').as('r:thing')).$
const r = findAll(query, [$('s:thing').$, $('r:thing').$], { wm, derivClauses: [] })
console.log(r)

export function copulaToHas(ast: ast_node, wm: WorldModel): ast_node {
    switch (ast.type) {
        case 'copula-sentence':

            {
                const query = $(ast.object.head).isa('s:thing').and($(ast.subject.head).has('s:thing').as('r:thing'))
                const r = findAll(query.$, [$('s:thing').$, $('r:thing').$], { wm, derivClauses: [] })
                const role = r[0]?.get($('r:thing').$)?.value

                if (!role) {
                    return ast
                }

                return {
                    type: 'has-sentence',
                    subject: {
                        head: ast.subject.head,
                        type: 'noun-phrase',
                    },
                    object: {
                        head: ast.object.head,
                        type: 'noun-phrase',
                    },
                    role: {
                        head: role,
                        type: 'noun-phrase',
                    }
                }

            }
        case 'noun-phrase':
            return {
                ...ast,
                suchThat: copulaToHas(ast.suchThat!, wm) as any
            }
    }

    throw new Error('not implemented!')
}


console.log(copulaToHas(parse('the button is red'), wm))




