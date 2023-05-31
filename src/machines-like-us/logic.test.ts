import { assert, assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "./exp-builder.ts";
import { findAll } from "./findAll.ts";
import { test } from "./test.ts";
import { KnowledgeBase } from "./types.ts";
import { WorldModel } from "./types.ts";
import { getParts } from "./wm-funcs.ts";

export const model: WorldModel = [

    /* World Model */
    ['event#1', 'birth-event'], // is-a
    ['event#1', 'person#1', 'baby'], // event#1 has person#1 as baby
    ['event#1', 'person#2', 'mother'],
    ['event#1', 'time-point#1', 'time'],
    ['event#1', 'space-point#1', 'location'],
    ['space-point#1', 'boston', 'enclosing-city'],
    ['person#1', 'event#1', 'birth'],
    ['person#2', 'woman'],
    ['person#1', 'person'],
    ['boston', 'city'],
    ['space-point#1', 'space-point'],
    ['door#1', 'door'],
    ['door-opening-event#1', 'door-opening-event'],
    ['door-opening-event#1', 'door#1', 'object'],
    ['door-closing-event#1', 'door-closing-event'],
    ['door-closing-event#1', 'door#1', 'object'],



    /* Conceptual Model */
    ['person', 'thing'], // is-a
    ['woman', 'person'],
    ['event', 'thing'],
    ['door-opening-event', 'event'],
    ['birth-event', 'event'],
    ['time-instant', 'thing'],
    ['point-in-space', 'thing'],
    ['city', 'thing'],
    ['multiple-birth-event', 'birth-event'],
    ['animal', 'thing'],
    ['bird', 'animal'],
    ['penguin', 'bird'],
    ['canary', 'bird'],
    ['move', 'thing'],
    ['fly', 'move'],
    ['swim', 'move'],

    ['birth-event', 'mother', 'part'],// birth-event has mother as a part
    ['birth-event', 'baby', 'part'],
    ['birth-event', 'time', 'part'],
    ['birth-event', 'location', 'part'],
    ['birth-event', 'vr#1', 'part'],
    ['birth-event', 'nr#2', 'part'],


    ['person', 'birth-event', 'birth'], // person has birth-event as birth

    ['mother', 'role'],// maybe uneeded
    ['baby', 'role'],// maybe uneeded
    ['time', 'role'],// maybe uneeded
    ['location', 'role'],// maybe uneeded

    ['vr#1', 'value-restriction'],
    ['vr#1', 'mother', 'subject'], // vr#1 has mother as a subject
    ['vr#1', 'woman', 'object'],

    ['nr#2', 'number-restriction'],
    ['nr#2', 'baby', 'subject'],
    ['nr#2', '1', 'object'],

    ['ann#1', 'cancel-annotation'],
    ['ann#1', 'nr#2', 'subject'],
    ['multiple-birth-event', 'ann#1', 'part'],
]


Deno.test({
    name: 'test1',
    fn: () => {
        const f = $('person#2').isa('person').$
        assert(test(f, { wm: model, derivClauses: [] }))
    }
})

Deno.test({
    name: 'test2',
    fn: () => {

        const derivClauses = [
            $('x:dude').isa('dude').when($('x:dude').isa('person')).$,
        ]

        const yes = $('person#2').isa('dude').$
        const no = $('person#2').isa('anythingelse').$

        assert(test(yes, { wm: model, derivClauses }))
        assert(!test(no, { wm: model, derivClauses }))
    }
})

Deno.test({
    name: 'test3',
    fn: () => {
        const f = $('x:person').isa('person').$
        const v = $('x:person').$
        const results = findAll(f, [v], { wm: model, derivClauses: [] })
        assertEquals(results.length, 3)
    }
})


Deno.test({
    name: 'test4',
    fn: () => {

        const dc = $('x:person').has('c:city').as('birth-city').when(
            $('e:event').exists.where($('y:space-point').exists.where(
                $('y:space-point').has('c:city').as('enclosing-city')
                    .and($('e:event').has('y:space-point').as('location'))
                    .and($('x:person').has('e:event').as('birth'))
            ))
        ).$

        const query = $('person#1').has('boston').as('birth-city').$

        assert(test(query, { wm: model, derivClauses: [dc] }))
    }
})

Deno.test({
    name: 'test5',
    fn: () => {

        const dc = $('d:door').has('z:state').as('state').after('s:seq|e:event').when(
            $('z:state').is('open').if($('e:event').isa('door-opening-event').and($('e:event').has('d:door').as('object')))
                .else($('z:state').is('closed').if($('e:event').isa('door-closing-event').and($('e:event').has('d:door').as('object')))
                    .else($('d:door').has('z:state').as('state').after('s:seq')))
        ).$

        const kb: KnowledgeBase = { wm: model, derivClauses: [dc] }
        const ok = $('door#1').has('open').as('state').after(['door-opening-event#1']).$
        const ok2 = $('door#1').has('closed').as('state').after(['door-closing-event#1']).$
        const ok3 = $('door#1').has('open').as('state').after(['door-closing-event#1', 'door-opening-event#1']).$
        const no = $('door#1').has('open').as('state').after(['event#1']).$
        const ok4 = $('door#1').has('open').as('state').after(['door-opening-event#1', 'event#1']).$
        const no2 = $('door#1').has('open').as('state').after(['door-closing-event#1', 'event#1']).$
        const ok5 = $('door#1').has('closed').as('state').after(['door-opening-event#1', 'door-opening-event#1', 'door-closing-event#1']).$
        const no3 = $('door#1').has('closed').as('state').after(['door-opening-event#1', 'door-closing-event#1', 'door-opening-event#1', 'event#1']).$
        const find1 = $('door#1').has('open').as('state').after(['e:event']).$

        assert(test(ok, kb))
        assert(test(ok2, kb))
        assert(test(ok3, kb))
        assert(!test(no, kb))
        assert(test(ok4, kb))
        assert(!test(no2, kb))
        assert(test(ok5, kb))
        assert(!test(no3, kb))
        const results = findAll(find1, [$('e:event').$], kb)
        assertEquals(results[0].get($('e:event').$)?.value, 'door-opening-event#1')

    }
})

Deno.test({
    name: 'test6',
    fn: () => {

        const dp = $({ isStupid: 'x:thing' }).when(
            $('x:thing').has('stupid').as('intelligence')
        ).$

        const kb: KnowledgeBase = {
            wm: [
                ['capra', 'animal'],
                ['cat', 'animal'],
                ['capra', 'stupid', 'intelligence'],
                ['cat', 'smart', 'intelligence'],
            ],
            derivClauses: [dp]
        }

        assert(test($({ isStupid: 'capra' }).$, kb))
        assert(!test($({ isStupid: 'cat' }).$, kb))

    }
})

// Deno.test({
//     name: 'test6',
//     fn: () => {

//         // this fails because the logic that checks inheritance of properties
//         // is missing.

//         const wm: WorldModel = [
//             ['speed', 'thing'],
//             ['fast', 'speed'],
//             ['slow', 'speed'],
//             ['animal', 'speed'],
//             ['cat', 'animal'],
//             ['animal', 'speed', 'speed'],
//             ['speed', 'thing'],
//         ]

//         const query = $('fast').isa('s:thing')
//             .and($('cat').has('s:thing').as('r:thing'))

//         const r = findAll(query.$, [$('s:thing').$, $('r:thing').$], { wm, derivClauses: [] })
//         assert(r[0]?.get($('s:thing').$)?.value === 'speed')

//     }
// })


// Deno.test({
//     name: 'test7',
//     fn: () => {

//         const wm: WorldModel = [
//             ['speed', 'thing'],
//             ['fast', 'speed'],
//             ['slow', 'speed'],
//             ['animal', 'speed'],
//             ['cat', 'animal'],
//             ['animal', 'speed', 'part'],
//             ['animal', 'vr#1', 'part'],
//             ['vr#1', 'value-restriction'],
//             ['vr#1', 'speed', 'subject'],
//             ['vr#1', 'speed', 'object'],
//             ['speed', 'thing'],
//         ]

//         console.log(getParts('cat', wm))
//     }
// })

