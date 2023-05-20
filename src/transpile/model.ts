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


