import { dumpWorldModel } from "./dumpWorldModel.ts";
import { $ } from "./exp-builder.ts";


const x = $({ subject: 'c:thing', isAKindOf: 'sc:thing' }).when(
    $('c:thing').has('sc:thing').as('superconcept')
).$

console.log(dumpWorldModel($({ subject: 'capra', isAKindOf: 'mammal' }).$, { wm: [], derivClauses: [x] }))

const x2 = $({ subject: 'c:thing', canHaveA: 'prop:thing' }).when(
    $('c:thing').has('prop:thing').as('part')
).$

console.log(dumpWorldModel($({ subject: 'mammal', canHaveA: 'hair' }).$, { wm: [], derivClauses: [x2] }))

const x3 =
    $({ vr: 'vr:thing', part: 'part:thing', ofConcept: 'owner-concept:thing', isA: 'value:thing' }).when(
        $('owner-concept:thing').has('vr:thing').as('part')
            .and($('vr:thing').isa('value-restriction'))
            .and($('vr:thing').has('part:thing').as('subject'))
            .and($('vr:thing').has('value:thing').as('object'))
    ).$

const test3 = $({ vr: 'vr#1', part: 'mother', ofConcept: 'birth', isA: 'woman' }).$
console.log(dumpWorldModel(test3, { wm: [], derivClauses: [x3] }))


const x4 =
    $({ nr: 'nr:thing', part: 'part:thing', ofConcept: 'owner-concept:thing', amountsTo: 'value:thing' }).when(
        $('owner-concept:thing').has('nr:thing').as('part')
            .and($('nr:thing').isa('number-restriction'))
            .and($('nr:thing').has('part:thing').as('subject'))
            .and($('nr:thing').has('value:thing').as('object'))
    ).$

const test4 = $({ nr: 'nr#1', part: 'mother', ofConcept: 'birth', amountsTo: 1 }).$

console.log(dumpWorldModel(test4, { wm: [], derivClauses: [x4] }))

// import { $ } from "./exp-builder.ts"
// import { HasSentence, IsASentence } from "./types.ts"

// type SideEffectAst = Individual
//     | IndividualRelation
//     | Concept
//     | Role
//     | ValueRestriction
//     | NumberRestriction
//     | DefaultAnnotation
//     | CancelAnnotation

// // cat#1 ISA cat
// type Individual = {
//     type: 'individual'
//     individual: string
//     concept: string
// }

// // cat#1 HAS mouse#1 AS fresh-kill
// type IndividualRelation = {
//     type: 'individual-relation'
//     individual1: string
//     individual2: string
//     relation: string
// }

// // cat ISAKINDOF feline
// type Concept = {
//     type: 'concept'
//     subconcept: string
//     superconcept: string
// }

// // cat CANHAVEA fresh-kill
// type Role = {
//     type: 'role'
//     concept: string
//     property: string
// }

// // fresh-kill OFA cat is a small-mammal
// type ValueRestriction = {
//     type: 'value-restriction'
//     id: string
//     concept: string
//     property: string
//     value: string
// }

// // fresh-kill OFA cat numbers 100
// type NumberRestriction = {
//     type: 'number-restriction'
//     id: string
//     concept: string
//     property: string
//     number: string
// }

// // ann#1: fresh-kill OFA cat DEFAULTSTO a mouse
// type DefaultAnnotation = {
//     type: 'default-annotation'
//     id: string
//     concept: string
//     property: string
//     default: string
// }

// // ann#2: ann#1 is cancelled for cat
// type CancelAnnotation = {
//     type: 'cancel-annotation'
//     id: string
//     concept: string
//     cancelledId: string
// }


// function sideEffectAstToGraph(ast: SideEffectAst): (HasSentence | IsASentence)[] {

//     switch (ast.type) {

//         case 'individual':
//             return [
//                 [ast.individual, ast.concept]
//             ]
//         case 'individual-relation':
//             return [
//                 [ast.individual1, ast.individual2, ast.relation]
//             ]
//         case 'concept':
//             return [
//                 [ast.subconcept, ast.superconcept, 'superconcept']
//             ]
//         case 'role':
//             return [
//                 [ast.concept, ast.property, 'part']
//             ]
//         case 'value-restriction':
//             return [
//                 [ast.concept, ast.id, 'part'],
//                 [ast.id, 'value-restriction'],
//                 [ast.id, ast.property, 'subject'],
//                 [ast.id, ast.value, 'object'],
//             ]
//         case 'number-restriction':
//             return [
//                 [ast.concept, ast.id, 'part'],
//                 [ast.id, 'number-restriction'],
//                 [ast.id, ast.property, 'subject'],
//                 [ast.id, ast.number, 'object'],
//             ]
//         case 'default-annotation':
//             return [
//                 [ast.concept, ast.id, 'part'],
//                 [ast.id, 'default-annotation'],
//                 [ast.id, ast.property, 'subject'],
//                 [ast.id, ast.default, 'obejct'],
//             ]
//         case 'cancel-annotation':
//             return [
//                 [ast.concept, ast.id, 'part'],
//                 [ast.id, 'cancel-annotation'],
//                 [ast.id, ast.cancelledId, 'subject'],
//             ]
//     }

// }

// console.log(sideEffectAstToGraph({
//     type: 'value-restriction',
//     concept: 'birth-event',
//     property: 'mother',
//     value: 'woman',
//     id: 'vr#1'
// }))


// // vr#2: a mother of a birth-event is a woman
// // [ast.concept, ast.id, 'part'],
// // [ast.id, 'value-restriction'],
// // [ast.id, ast.property, 'subject'],
// // [ast.id, ast.value, 'object'],

// /* vr:value-restriction: p:thing of x:concept is a v:thing   if */ 
// $('x:concept').has('vr:value-restriction').as('part')
//     .and($('vr:value-restriction').isa('value-restriction'))
//     .and($('vr:value-restriction').has('p:thing').as('subject'))
//     .and($('vr:value-restriction').has('v:thing').as('object'))

// // $('vr:value-restriction').$(':').('p:thing').$('of').$('x:concept').$('isa').('v:thing')

// // generalized LLAST with any kinds of symbols

// // class Builder {

// //     exp: Partial<SideEffectAst> | string

// //     constructor(symbol: string) {
// //         this.exp = symbol
// //     }

// //     hasA(symbol: string) {
// //         this.exp = {
// //             type: 'role',
// //             concept: this.exp as string,
// //             property: symbol,
// //         }
// //         return this
// //     }

// //     ofA(symbol: string) {
// //         // 
// //         return this
// //     }

// //     isA(symbol: string) {
// //         return this
// //     }

// //     get $() {
// //         return sideEffectAstToGraph(this.exp as SideEffectAst)
// //     }

// // }

// // console.log(new Builder('birth-event').hasA('mother').$)

// // new Builder('mother').ofA('birth-event').isA('woman')


