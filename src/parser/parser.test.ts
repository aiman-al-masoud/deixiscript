import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "../core/exp-builder.ts"
import { parse } from "./parse.ts";
import { linearize } from "./linearize.ts";
import { tokenize } from "./tokenize.ts";
import { match } from "../core/match.ts";


const kb = $.p(['x:thing|and', 'y:thing|']).when($.p('x:thing').and($.p('y:thing')))
    .and($.p(['if', 'x:thing|then', 'y:thing|']).when($.p('y:thing').if($.p('x:thing'))))
    .and($.p(['x:thing|when', 'y:thing|']).when($.p('x:thing').when($.p('y:thing'))))
    .and($.p(['the', 'x:thing|which', 'y:thing|']).when($.the($.p('x:thing')).which($.p('y:thing'))))
    .and($('in').isa('preposition')) // currently not being fully exploited 
    .and($.p(['x:thing|o:operator', 'y:thing|']).when($.p('x:thing').mathOperation($.p('y:thing'), 'o:operator')))
    .and($('+').and('-').and('*').and('/').isa('operator'))
    .and($('is').and('are').and('be').isa('esse'))
    .and($('esse').isa('verb'))
    .and($.p(['does', 'x:thing|v:verb', 'z:thing|']).when($.p('x:thing').does($.p('v:verb'))._($.p('z:thing')).ask))
    .and($.p(['does', 'v:thing', 'z:thing|']).when($._.does($.p('v:thing'))._($.p('z:thing'))))
    .and($.p(['does', 'v:thing']).when($._.does($.p('v:thing'))))
    .and($.p(['x:thing|does', 'y:thing', 'z:thing|w:preposition', 'w:thing|']).when($.p('x:thing').does($.p('y:thing'))._($.p('z:thing')).in($.p('w:thing'))))
    .and($.p(['x:thing|does', 'not', 'y:thing', 'z:thing|']).when($.p('x:thing').does($.p('y:thing'))._($.p('z:thing')).isNotTheCase))
    .and($.p(['x:thing|does', 'y:thing', 'z:thing|']).when($.p('x:thing').does($.p('y:thing'))._($.p('z:thing'))))
    .and($.p(['is', 'a', 'y:thing']).when($._.isa($.p('y:thing'))))
    .and($.p(['x:thing|is', 'a', 'y:thing']).when($.p('x:thing').isa($.p('y:thing'))))
    .and($.p(['x:thing|v:verb', 'z:thing|']).when($.p('x:thing').does($.p('v:verb'))._($.p('z:thing'))))
    .and($('has').and('have').isa('habere'))
    .and($('habere').isa('verb'))
    .and($.p(['x:thing|x:habere', 'y:thing|as', 'z:thing|']).when($.p('x:thing').has($.p('y:thing')).as($.p('z:thing'))))
    .and($.p(['the', 'x:thing|of', 'y:thing|']).when($.the($.p('x:thing')).of($.p('y:thing'))))
    .and($.p(['x:thing|of', 'y:thing|']).when($.the($.p('x:thing')).of($.p('y:thing'))))
    .and($.p(['the', 'x:thing|in', 'y:thing|']).when($.the($.p('x:thing')).in($.p('y:thing'))))
    .and($.p(['the', 'x:thing']).when($.the($.p('x:thing'))))
    .and($.p(['[', 'l:thing|]']).when('l:thing')) //here
    .and($.p(['(', 'x:thing|)']).when($.p('x:thing')))
    .and($.p(['x:thing']).when('x:thing'))
    .and($.p('x:thing').when('x:thing'))
    .dump()



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
        assertEquals(parse($.p(tokenize('( if x is a cat then y is a dog )')).$, kb), $('y').isa('dog').if($('x').isa('cat')).$)
    }
})


Deno.test({
    name: 'parser-test04',
    fn: () => {
        assertEquals(parse($.p(tokenize('( if the cat is a feline then the dog is a canine )')).$, kb), $.the('dog').isa('canine').if($.the('cat').isa('feline')).$)
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
        assertEquals(parse($.p(tokenize('the cat and the dog')).$, kb), $.the('cat').and($.the('dog')).$)

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
        assertEquals(parse($.p(tokenize('the animal which is a cat')).$, kb), $.the('animal').which($._.isa('cat')).$)

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
        assertEquals(parse($.p(tokenize('the cat does eat the mouse')).$, kb), $.the('cat').does('eat')._($.the('mouse')).$)

    }
})

Deno.test({
    name: 'parser-test13',
    fn: () => {
        assertEquals(parse($.p(tokenize('the cat does eat the mouse in the house')).$, kb), $.the('cat').does('eat')._($.the('mouse')).in($.the('house')).$)

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
        assertEquals(parse($.p(tokenize('it when the thing')).$, kb), $('it').when($.the('thing')).$)

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
        assertEquals(parse($.p(tokenize('fib of 4')).$, kb), $.the('fib').of(4).$)

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
        assertEquals(parse($.p(tokenize('the cat does eat (the mouse which does run)')).$, kb), $.the('cat').does('eat')._($.the('mouse').which($._.does('run'))).$)

    }
})

Deno.test({
    name: 'parser-test23',
    fn: () => {
        assertEquals(parse($.p(tokenize('1 be 1')).$, kb), $(1).is(1).$)

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
        assertEquals(parse($.p(tokenize(' ( 1  - 2 ) * 3 ')).$, kb), $(1).minus(2).times(3).$)

    }
})

Deno.test({
    name: 'parser-test27',
    fn: () => {
        assertEquals(parse($.p(tokenize('the cat does not eat the mouse')).$, kb), $.the('cat').does('eat')._($.the('mouse')).isNotTheCase.$)

    }
})

Deno.test({
    name: 'parser-test28',
    fn: () => {
        assertEquals(parse($.p(tokenize('THE CAT')).$, kb), $.the('cat').$)

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
        assertEquals(parse($.p(tokenize('does the cat have the mouse')).$, kb), $.the('cat').does('have')._($.the('mouse')).ask.$)
    }
})


Deno.test({
    name: 'parser-test32',
    fn: () => {
        const original = $.the('cat').does('eat')._($.the('mouse')).$
        const code = linearize(original, kb)!
        const ast = parse($.p(tokenize(code)).$, kb)
        assertEquals(ast, original)
    }
})

Deno.test({
    name: 'parser-test33',
    fn: () => {
        const original = $.the('cat').and($.the('dog')).$
        const code = linearize(original, kb)!
        const ast = parse($.p(tokenize(code)).$, kb)
        assertEquals(ast, original)
    }
})

Deno.test({
    name: 'parser-test34',
    fn: () => {
        const original = $.the('cat').does('eat')._($.the('mouse').which($._.does('run').and($._.does('hide')))).$
        const code = linearize(original, kb)!
        const ast = parse($.p(tokenize(code)).$, kb)
        assertEquals(ast, original)
    }
})

Deno.test({
    name: 'parser-test35',
    fn: () => {


        const original = $.the('cat').does('eat')._($.the('mouse').which($._.does('eat')._('cheese'))).$
        const code = linearize(original, kb)!

        const ast = parse($.p(tokenize(code)).$, kb)
        assertEquals(ast, original)

    }
})

Deno.test({
    name: 'parser-test36',
    fn: () => {

        // const original = $.the('cat').does('eat')._( $.the('mouse').which($._.does('love')._($.the('cheese')))).$
        // const original = $.the('mouse').which($._.does('love')._($.the('cheese'))).$
        // const code = linearize(original, kb)!


        // const wrap = (v: LLangAst) => mapAsts(v, x => $({ parse: x }).$, { top: false })
        // const m = match(
        //     $.the($.p('x:thing')).which($.p('y:thing')).$,
        //     wrap($.the('mouse').which($._.does('love')._($.the('cheese'))).$),
        //     kb,
        // )

        const m = match(
            $.the('x:thing').which($('y:thing')).$,
            $.the('mouse').which($._.does('love')._($.the('cheese'))).$,
            kb,
        )

        console.log(m?.helperMap)
    }
})