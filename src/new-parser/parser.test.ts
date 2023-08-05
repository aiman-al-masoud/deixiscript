import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "../core/exp-builder.ts"
import { parse } from "./parse.ts";
import { linearize } from "./linearize.ts";
import { tokenize } from "./tokenize.ts";


Deno.test({
    name: 'test76',
    fn: () => {
        // alt parser...
        const kb = $.p(['x:thing|and', 'y:thing|']).when($.p('x:thing').and($.p('y:thing')))
            .and($.p(['if', 'x:thing|then', 'y:thing|']).when($.p('y:thing').if($.p('x:thing'))))
            .and($.p(['x:thing|when', 'y:thing|']).when($.p('x:thing').when($.p('y:thing'))))
            .and($.p(['the', 'x:thing|which', 'y:thing|']).when($.the($.p('x:thing')).which($.p('y:thing'))))
            .and($('in').isa('preposition')) // currently not being fully exploited 
            .and($.p(['does', 'v:thing']).when($._.does($.p('v:thing'))))
            .and($.p(['x:thing|does', 'y:thing', 'z:thing|w:preposition', 'w:thing|']).when($.p('x:thing').does($.p('y:thing'))._($.p('z:thing')).in($.p('w:thing'))))
            .and($.p(['x:thing|does', 'y:thing', 'z:thing|']).when($.p('x:thing').does($.p('y:thing'))._($.p('z:thing'))))
            .and($.p(['is', 'a', 'y:thing']).when($._.isa($.p('y:thing'))))
            .and($.p(['x:thing|is', 'a', 'y:thing']).when($.p('x:thing').isa($.p('y:thing'))))
            .and($('has').and('have').isa('habere'))
            .and($.p(['x:thing|x:habere', 'y:thing|as', 'z:thing|']).when($.p('x:thing').has($.p('y:thing')).as($.p('z:thing'))))
            .and($.p(['the', 'x:thing|of', 'y:thing|']).when($.the($.p('x:thing')).of($.p('y:thing'))))
            .and($.p(['x:thing|of', 'y:thing|']).when($.the($.p('x:thing')).of($.p('y:thing'))))
            .and($.p(['the', 'x:thing|in', 'y:thing|']).when($.the($.p('x:thing')).in($.p('y:thing'))))
            .and($.p(['the', 'x:thing']).when($.the($.p('x:thing'))))
            .and($.p(['[', 'x:thing|]']).when('x:thing'))
            .and($.p(['(', 'x:thing|)']).when($.p('x:thing')))
            .and($.p(['x:thing']).when('x:thing'))
            .and($.p('x:thing').when('x:thing'))
            .dump()


        assertEquals(tokenize('"ciao mondo" is the (string) " ciao a tutti " 1 2 false true 300'), ['"ciao mondo"', 'is', 'the', '(', 'string', ')', '" ciao a tutti "', 1, 2, false, true, 300])
        assertEquals(parse($.p(tokenize('if x is a cat then y is a dog')).$, kb), $('y').isa('dog').if($('x').isa('cat')).$)
        assertEquals(parse($.p(tokenize('( if x is a cat then y is a dog )')).$, kb), $('y').isa('dog').if($('x').isa('cat')).$)
        assertEquals(parse($.p(tokenize('( if the cat is a feline then the dog is a canine )')).$, kb), $.the('dog').isa('canine').if($.the('cat').isa('feline')).$)
        assertEquals(parse($.p(tokenize('[ capra x:ciao ]')).$, kb), $(['capra', 'x:ciao']).$)
        assertEquals(parse($.p(tokenize('the cat and the dog')).$, kb), $.the('cat').and($.the('dog')).$)
        assertEquals(parse($.p(tokenize('( cat and dog ) and meerkat')).$, kb), $('cat').and('dog').and('meerkat').$)
        assertEquals(parse($.p(tokenize('cat and dog and meerkat')).$, kb), $('cat').and($('dog').and('meerkat')).$)
        assertEquals(parse($.p(tokenize('cat and ( dog and meerkat )')).$, kb), $('cat').and($('dog').and('meerkat')).$)
        assertEquals(parse($.p(tokenize('the animal which is a cat')).$, kb), $.the('animal').which($._.isa('cat')).$)
        assertEquals(parse($.p(tokenize('( x and y and z ) is a mammal')).$, kb), $('x').and($('y').and('z')).isa('mammal').$)
        assertEquals(parse($.p(tokenize('the cat does eat the mouse')).$, kb), $.the('cat').does('eat')._($.the('mouse')).$)
        assertEquals(parse($.p(tokenize('the cat does eat the mouse in the house')).$, kb), $.the('cat').does('eat')._($.the('mouse')).in($.the('house')).$)
        assertEquals(parse($.p(tokenize('the cat does eat ( the mouse in the house )')).$, kb), $.the('cat').does('eat')._($.the('mouse').in($.the('house'))).$)
        assertEquals(parse($.p(tokenize('it when the thing')).$, kb), $('it').when($.the('thing')).$)
        assertEquals(parse($.p(tokenize('cat has high as hunger')).$, kb), $('cat').has('high').as('hunger').$)
        assertEquals(parse($.p(tokenize('cat have high as hunger')).$, kb), $('cat').has('high').as('hunger').$)
        assertEquals(parse($.p(tokenize('the cat is a feline when the sky has blue as color')).$, kb), $.the('cat').isa('feline').when($.the('sky').has('blue').as('color')).$)
        assertEquals(parse($.p(tokenize('the sum of ( 1 and 2 )')).$, kb), $.the('sum').of($(1).and(2)).$)
        assertEquals(parse($.p(tokenize('fib of 4')).$, kb), $.the('fib').of(4).$)
        assertEquals(parse($.p(tokenize('cat#1')).$, kb), $('cat#1').$)
        assertEquals(parse($.p(tokenize('the cat does eat (the mouse which does run)')).$, kb), $.the('cat').does('eat')._($.the('mouse').which($._.does('run'))).$)


        // console.log(tok('"ciao mondo" is the (string) " ciao a tutti " 1 2 '))

        // console.log(parse($.p(tok('"ciao  mondo A"')).$, kb))

        // console.log(tok('"ciao mondo" is (the string) " ciao a tutti " 1 2 '))

        // assertEquals(parse($.p(tokenize('cat#1')).$, kb), $('cat#1').$)

        // console.log(tokenize('" ciao mondo "'))
        // console.log($.p(tokenize('" ciao mondo "')).$)
        // console.log(parse($.p(tokenize('" ciao mondo "')).$, kb))


        // const t = $.p(['"', 'x:thing|"']).$
        // const f = $.p(tokenize('" ciao mondo "')).$
        // console.log(t)
        // console.log(f)
        // const m = match(t ,f, kb)
        // console.log(m)



        // lin($('cat').and('dog').$, kb)
        // lin($('cat').and($('dog').and('meerkat')).$, kb)
        // lin($('cat').isa('feline').$, kb)
        // const original = $.the('cat').and($.the('dog')).$
        const original = $.the('cat').does('eat')._($.the('mouse')).$
        const code = linearize(original, kb)!
        const ast = parse($.p(tokenize(code)).$, kb)
        assertEquals(ast, original)
        // lin($('cat').does('eat')._('mouse').$, kb)

        // const l1 = linearize(o1, kb)!
        // console.log(l1)
        // const a1 = parse($({ parse: tokenize(l1) ).$, kb)
        // console.log(a1)
        // console.log(ts)
        // console.log(a)

        // assertEquals(a1, o1)

        // const x = $.the('cat').which($._.does('eat') ).$
        // console.log(x)
        // console.log(linearize(x, kb))

        // console.log(tokenize(''))

        // const a1 = mapNodes($('cat').isa('feline').$, x => $({parse:x).$ )
        // const a2 = mapNodes(a1, x=>x.type==='generalized' && x['parse']  ? x['parse'] :x )
        // console.log(a1)
        // console.log(a2)
    }
})