import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "../core/exp-builder.ts"
import { parse } from "./parse.ts";
// import { linearize } from "./linearize.ts";
import { tokenize } from "./tokenize.ts";
import { removeImplicit } from "../core/removeImplicit.ts";


const kb =

    $.p(['x:list', 'and', 'y:list']).when($.p('x:list').and($.p('y:list')))
        .and($.p(['if', 'x:list', 'then', 'y:list']).when($.p('y:list').if($.p('x:list'))))
        .and($.p(['x:list', 'when', 'y:list']).when($.p('x:list').when($.p('y:list'))))
        .and($.p(['x:list', 'which', 'y:list']).when($.p('x:list').which($.p('y:list'))))
        .and($('in').isa('preposition')) // currently not being fully exploited 
        .and($.p(['x:list', 'o:operator', 'y:list']).when($.p('x:list').mathOperation($.p('y:list'), 'o:operator')))
        .and($('+').and('-').and('*').and('/').and('=').isa('operator'))
        .and($('is').and('are').and('be').isa('esse'))
        .and($('esse').isa('verb'))
        .and($.p(['x:list', 'x:habere', 'y:list', 'as', 'z:list']).when($.p('x:list').has($.p('y:list')).as($.p('z:list'))))
        .and($.p(['does', 'x:list', 'v:verb', 'z:list']).when($.p('x:list').does($.p('v:verb'))._($.p('z:list'))))
        .and($.p(['does', 'v:thing', 'z:list']).when($._.does($.p('v:thing'))._($.p('z:list'))))
        .and($.p(['does', 'v:thing']).when($._.does($.p('v:thing'))))
        .and($.p(['x:list', 'does', 'v:thing', 'z:list', 'p:preposition', 'c:list']).when($.p('x:list').does($.p('v:thing'))._($.p('z:list')).in($.p('c:list'))))
        .and($.p(['x:list', 'does', 'not', 'v:thing', 'z:list']).when($.p('x:list').does($.p('v:thing'))._($.p('z:list')).isNotTheCase))
        .and($.p(['x:list', 'does', 'v:thing', 'z:list']).when($.p('x:list').does($.p('v:thing'))._($.p('z:list'))))
        .and($.p(['is', 'a', 'x:list']).when($._.isa($.p('x:list'))))
        .and($.p(['x:list', 'is', 'a', 'y:list']).when($.p('x:list').isa($.p('y:list'))))
        .and($.p(['x:list', 'v:verb', 'z:list']).when($.p('x:list').does($.p('v:verb'))._($.p('z:list'))))
        .and($('has').and('have').isa('habere'))
        .and($('habere').isa('verb'))
        .and($.p(['x:list', 'of', 'y:list']).when($.p('x:list').of($.p('y:list'))))
        .and($.p(['x:list', 'in', 'y:list']).when($.p('x:list').in($.p('y:list'))))
        .and($.p(['the', 'x:list']).when($.the($.p('x:list')))) //
        .and($.p(['the', 'x:thing']).when($.the($.p('x:thing')))) //
        .and($.p(['[', 'l:list', ']']).when('l:list'))
        .and($.p(['(', 'x:list', ')']).when($.p('x:list')))
        .and($.p(['x:thing']).when('x:thing'))
        .and($.p('x:thing').when('x:thing'))
        .dump()

// console.log(kb.derivClauses)
// Deno.exit()

Deno.test({
    name: 'parser-test01',
    fn: () => {
        assertEquals(
            tokenize('"ciao mondo" is the (string) " ciao a tutti " 1 2 false true 300'),
            ['"ciao mondo"', 'is', 'the', '(', 'string', ')', '" ciao a tutti "', 1, 2, false, true, 300]
        )
    }
})

Deno.test({
    name: 'parser-test02',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('if x is a cat then y is a dog')).$, kb),
            $('y').isa('dog').if($('x').isa('cat')).$
        )
    }
})

Deno.test({
    name: 'parser-test03',
    fn: () => {
        assertEquals(parse($.p(tokenize('if x is a cat then y is a dog')).$, kb), $('y').isa('dog').if($('x').isa('cat')).$)
    }
})

Deno.test({
    name: 'parser-test04',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('( if the cat is a feline then the dog is a canine )')).$, kb),
            removeImplicit($.the('dog').isa('canine').if($.the('cat').isa('feline')).$),
        )
    }
})

Deno.test({
    name: 'parser-test05',
    fn: () => {
        assertEquals(parse($.p(tokenize('[ capra x:ciao ]')).$, kb), $(['capra', 'x:ciao']).$)
    }
})

Deno.test({
    name: 'parser-test06',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('the cat and the dog')).$, kb),
            removeImplicit($.the('cat').and($.the('dog')).$),
        )
    }
})

Deno.test({
    name: 'parser-test07',
    fn: () => {
        assertEquals(parse($.p(tokenize('( cat and dog ) and meerkat')).$, kb), $('cat').and('dog').and('meerkat').$)

    }
})

Deno.test({
    name: 'parser-test08',
    fn: () => {
        assertEquals(parse($.p(tokenize('cat and dog and meerkat')).$, kb), $('cat').and($('dog').and('meerkat')).$)

    }
})

Deno.test({
    name: 'parser-test09',
    fn: () => {
        assertEquals(parse($.p(tokenize('cat and ( dog and meerkat )')).$, kb), $('cat').and($('dog').and('meerkat')).$)

    }
})

Deno.test({
    name: 'parser-test10',
    fn: () => {
        // console.log(parse($.p(tokenize('the animal which is a cat')).$, kb))
        assertEquals(
            removeImplicit(parse($.p(tokenize('the animal which is a cat')).$, kb)),
            removeImplicit($.the('animal').which($._.isa('cat')).$),
        )

    }
})

Deno.test({
    name: 'parser-test11',
    fn: () => {
        assertEquals(parse($.p(tokenize('( x and y and z ) is a mammal')).$, kb), $('x').and($('y').and('z')).isa('mammal').$)

    }
})

Deno.test({
    name: 'parser-test12',
    fn: () => {
        assertEquals(
            removeImplicit(parse($.p(tokenize('the cat does eat the mouse')).$, kb)),
            removeImplicit($.the('cat').does('eat')._($.the('mouse')).$),
        )

    }
})

Deno.test({
    name: 'parser-test13',
    fn: () => {
        assertEquals(
            removeImplicit(parse($.p(tokenize('the cat does eat the mouse in the house')).$, kb)),
            removeImplicit($.the('cat').does('eat')._($.the('mouse')).in($.the('house')).$),
        )

    }
})

Deno.test({
    name: 'parser-test14',
    fn: () => {
        assertEquals(parse($.p(tokenize('the cat does eat ( the mouse in the house )')).$, kb), $.the('cat').does('eat')._($.the('mouse').in($.the('house'))).$)

    }
})

Deno.test({
    name: 'parser-test15',
    fn: () => {
        assertEquals(
            removeImplicit(parse($.p(tokenize('it when the thing')).$, kb)),
            removeImplicit($('it').when($.the('thing')).$),
        )

    }
})

Deno.test({
    name: 'parser-test16',
    fn: () => {
        assertEquals(parse($.p(tokenize('cat has high as hunger')).$, kb), $('cat').has('high').as('hunger').$)

    }
})

Deno.test({
    name: 'parser-test17',
    fn: () => {
        assertEquals(parse($.p(tokenize('cat have high as hunger')).$, kb), $('cat').has('high').as('hunger').$)

    }
})

Deno.test({
    name: 'parser-test18',
    fn: () => {
        assertEquals(parse($.p(tokenize('the cat is a feline when the sky has blue as color')).$, kb), $.the('cat').isa('feline').when($.the('sky').has('blue').as('color')).$)

    }
})

Deno.test({
    name: 'parser-test19',
    fn: () => {
        assertEquals(parse($.p(tokenize('the sum of ( 1 and 2 )')).$, kb), $.the('sum').of($(1).and(2)).$)

    }
})

Deno.test({
    name: 'parser-test20',
    fn: () => {

        console.log(parse($.p(tokenize('the fib of 4')).$, kb))
        console.log('---------------------------------')
        console.log(removeImplicit($.the('fib').of(4).$))
        // assertEquals(
        //     parse($.p(tokenize('the fib of 4')).$, kb), 
        //     removeImplicit($.the('fib').of(4).$),
        // )

    }
})

Deno.test({
    name: 'parser-test21',
    fn: () => {
        assertEquals(parse($.p(tokenize('cat#1')).$, kb), $('cat#1').$)

    }
})

Deno.test({
    name: 'parser-test22',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('the cat does eat (the mouse which does run)')).$, kb),
            removeImplicit($.the('cat').does('eat')._($.the('mouse').which($._.does('run'))).$),
        )
    }
})

Deno.test({
    name: 'parser-test23',
    fn: () => {
        assertEquals(parse($.p(tokenize('1 + 2')).$, kb), $(1).plus(2).$)
    }
})

Deno.test({
    name: 'parser-test24',
    fn: () => {
        assertEquals(parse($.p(tokenize(' ( 1  + 2 ) + 3 ')).$, kb), $(1).plus(2).plus(3).$)

    }
})

Deno.test({
    name: 'parser-test25',
    fn: () => {
        assertEquals(parse($.p(tokenize(' 1 + 2 + 3 ')).$, kb), $(1).plus($(2).plus(3)).$)

    }
})

Deno.test({
    name: 'parser-test26',
    fn: () => {
        assertEquals(
            parse($.p(tokenize(' ( 1  - 2 ) * 3 ')).$, kb),
            $(1).minus(2).times(3).$,
        )

    }
})

Deno.test({
    name: 'parser-test26.5',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('1 = 2')).$, kb),
            $(1).mathOperation(2, '=').$,
        )
    }
})

Deno.test({
    name: 'parser-test27',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('the cat does not eat the mouse')).$, kb),
            removeImplicit($.the('cat').does('eat')._($.the('mouse')).isNotTheCase.$),
        )

    }
})

Deno.test({
    name: 'parser-test28',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('THE CAT')).$, kb),
            removeImplicit($.the('cat').$),
        )
    }
})

Deno.test({
    name: 'parser-test29',
    fn: () => {
        assertNotEquals(parse($.p(tokenize('"ciao mondo"')).$, kb), $('"CIAO MONDO"').$)

    }
})

Deno.test({
    name: 'parser-test30',
    fn: () => {
        assertEquals(parse($.p(tokenize('"ciao mondo"')).$, kb), $('"ciao mondo"').$)
    }
})

Deno.test({
    name: 'parser-test31',
    fn: () => {
        assertEquals(
            parse($.p(tokenize('does the cat have the mouse')).$, kb),
            removeImplicit($.the('cat').does('have')._($.the('mouse')).$),
        )
    }
})


// Deno.test({
//     name: 'parser-test32',
//     fn: () => {
//         const original = $.the('cat').does('eat')._($.the('mouse')).$
//         const code = linearize(original, kb)!
//         // console.log(code)
//         const ast = parse($.p(tokenize(code)).$, kb)
//         assertEquals(ast, original)
//     }
// })

// Deno.test({
//     name: 'parser-test33',
//     fn: () => {
//         const original = $.the('cat').and($.the('dog')).$
//         const code = linearize(original, kb)!
//         // console.log(code)
//         const ast = parse($.p(tokenize(code)).$, kb)
//         assertEquals(ast, original)
//     }
// })

// Deno.test({
//     name: 'parser-test33.5',
//     fn: () => {
//         const original = $.the('cat').does('eat')._($.the('mouse')).$
//         const code = linearize(original, kb)!
//         const ast = parse($.p(tokenize(code)).$, kb)
//         assertEquals(ast, original)
//     }
// })

// Deno.test({
//     name: 'parser-test34',
//     fn: () => {
//         const original = $.the('cat').does('eat')._($.the('mouse').which($._.does('run').and($._.does('hide')))).$
//         const code = linearize(original, kb)!
//         const ast = parse($.p(tokenize(code)).$, kb)
//         assertEquals(ast, original)
//     }
// })

// // Deno.test({
// //     name: 'parser-test35',
// //     fn: () => {

// //         // const newAst= {
// //         //     subject: { parse: { type: "entity", value: "" }, type: "generalized" },
// //         //     verb: { parse: { type: "entity", value: "eat" }, type: "generalized" },
// //         //     object: { parse: { type: "entity", value: "cheese" }, type: "generalized" },
// //         //     type: "generalized",
// //         //   } as any as GeneralizedFormula

// //         // const t = $.p($._).does($.p('v:thing'))._($.p('z:list')).$

// //         // console.log(t)

// //         // const m = match(t, newAst, $.emptyKb)
// //         // console.log(m)

// //         // throw new Error(``)

// //         const original = $.the('cat').does('eat')._($.the('mouse').which($._.does('eat')._( 'cheese')  )).$
// //         const code = linearize(original, kb)!
// //         const ast = parse($.p(tokenize(code)).$, kb)
// //         assertEquals(ast, original)
// //     }
// // })

// Deno.test({
//     name: 'parser-test36',
//     fn: () => {
//         const original = $.the('cat').does('eat')._($.the('mouse').which($._.does('love')._($.the('cheese').and($.the('grain'))))).$
//         const code = linearize(original, kb)!
//         // console.log(code)
//         const ast = parse($.p(tokenize(code)).$, kb)
//         assertEquals(ast, original)
//     }
// })



