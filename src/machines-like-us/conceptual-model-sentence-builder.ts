import { random } from "../utils/random.ts"
import { HasSentence, IsASentence } from "./types.ts"

type SideEffectAst = Individual
    | IndividualRelation
    | Concept
    | Role
    | ValueRestriction
    | NumberRestriction
    | DefaultAnnotation
    | CancelAnnotation

// cat#1 ISA cat
type Individual = {
    type: 'individual'
    individual: string
    concept: string
}

// cat#1 HAS mouse#1 AS fresh-kill
type IndividualRelation = {
    type: 'individual-relation'
    individual1: string
    individual2: string
    relation: string
}

// cat ISAKINDOF feline
type Concept = {
    type: 'concept'
    subconcept: string
    superconcept: string
}

// cat CANHAVEA fresh-kill
type Role = {
    type: 'role'
    concept: string
    property: string
}

// fresh-kill OFA cat is a small-mammal
type ValueRestriction = {
    type: 'value-restriction'
    concept: string
    property: string
    value: string
}

// fresh-kill OFA cat numbers 100
type NumberRestriction = {
    type: 'number-restriction'
    concept: string
    property: string
    number: string
}

// ann#1: fresh-kill OFA cat DEFAULTSTO a mouse
type DefaultAnnotation = {
    type: 'default-annotation'
    // annotation:string
    concept: string
    property: string
    default: string
}

// ann#2: ann#1 is cancelled for cat
type CancelAnnotation = {
    type: 'cancel-annotation'
    // annotation:string
    concept: string
    restriction: string
}


function sideEffectAstToGraph(ast: SideEffectAst): (HasSentence | IsASentence)[] {

    switch (ast.type) {

        case 'individual':
            return [
                [ast.individual, ast.concept]
            ]
        case 'individual-relation':
            return [
                [ast.individual1, ast.individual2, ast.relation]
            ]
        case 'concept':
            return [
                [ast.subconcept, ast.superconcept, 'superconcept']
            ]
        case 'role':
            return [
                [ast.concept, ast.property, 'part']
            ]
        case 'value-restriction':
            const vrId = 'vr#' + random()
            return [
                [ast.concept, vrId, 'part'],
                [vrId, 'value-restriction'],
                [vrId, ast.property, 'subject'],
                [vrId, ast.value, 'object'],
            ]
        case 'number-restriction':
            const nrId = 'nr#' + random()
            return [
                [ast.concept, nrId, 'part'],
                [nrId, 'number-restriction'],
                [nrId, ast.property, 'subject'],
                [nrId, ast.number, 'object'],
            ]
        case 'default-annotation':
            const daId = 'ann#' + random()
            return [
                [ast.concept, daId, 'part'],
                [daId, 'default-annotation'],
                [daId, ast.property, 'subject'],
                [daId, ast.default, 'obejct'],
            ]
        case 'cancel-annotation':
            const caId = 'ann#' + random()
            return [
                [ast.concept, caId, 'part'],
                [caId, 'cancel-annotation'],
                [caId, ast.restriction, 'subject'],
            ]

    }

}

console.log(sideEffectAstToGraph({
    type: 'value-restriction',
    concept: 'birth-event',
    property: 'mother',
    value: 'woman'
}))


// class Builder {

//     exp: Partial<SideEffectAst> | string

//     constructor(symbol: string) {
//         this.exp = symbol
//     }

//     hasA(symbol: string) {
//         this.exp = {
//             type: 'role',
//             concept: this.exp as string,
//             property: symbol,
//         }
//         return this
//     }

//     ofA(symbol: string) {
//         // 
//         return this
//     }

//     isA(symbol: string) {
//         return this
//     }

//     get $() {
//         return sideEffectAstToGraph(this.exp as SideEffectAst)
//     }

// }

// console.log(new Builder('birth-event').hasA('mother').$)

// new Builder('mother').ofA('birth-event').isA('woman')


