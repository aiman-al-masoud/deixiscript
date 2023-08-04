import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { $ } from "../core/exp-builder.ts"
import { parseNumber } from "../utils/parseNumber.ts";
import { parse } from "./parse.ts";
import { linearize } from "./linearize.ts";
import { tokenize } from "./tokenize.ts";

// function p(ast:LLangAst){
//     return $({parse:ast})
// }

Deno.test({
    name: 'test76',
    fn: () => {
        // alt parser...
        const kb = $.p(['x:thing|and', 'y:thing|']).when($.p('x:thing').and($.p('y:thing')))
            .and($.p(['if', 'x:thing|then', 'y:thing|']).when($.p('y:thing').if($.p('x:thing'))))
            .and($.p(['x:thing|when', 'y:thing|']).when($.p('x:thing').when($.p('y:thing'))))
            .and($.p(['the', 'x:thing|which', 'y:thing|']).when($.the($.p('x:thing')).which($.p('y:thing'))))
            .and($('in').isa('preposition')) // currently not being used fully because cannot subst name of complement because it's a POJO key
            .and($.p(['does', 'v:thing']).when($._.does($.p('v:thing'))))


            .and($({ parse: ['x:thing|does', 'y:thing', 'z:thing|w:preposition', 'w:thing|'] }).when($({ parse: 'x:thing' }).does($({ parse: 'y:thing' }))._($({ parse: 'z:thing' })).in($({ parse: 'w:thing' }))))
            .and($({ parse: ['x:thing|does', 'y:thing', 'z:thing|'] }).when($({ parse: 'x:thing' }).does($({ parse: 'y:thing' }))._($({ parse: 'z:thing' }))))
            .and($({ parse: ['is', 'a', 'y:thing'], }).when($._.isa($({ parse: 'y:thing' }))))
            .and($({ parse: ['x:thing|is', 'a', 'y:thing'], }).when($({ parse: 'x:thing' }).isa($({ parse: 'y:thing' }))))
            .and($('has').and('have').isa('habere'))
            .and($({ parse: ['x:thing|x:habere', 'y:thing|as', 'z:thing|'] }).when($({ parse: 'x:thing' }).has($({ parse: 'y:thing' })).as($({ parse: 'z:thing' }))))
            .and($({ parse: ['the', 'x:thing|of', 'y:thing|'] }).when($.the($({ parse: 'x:thing' })).of($({ parse: 'y:thing' }))))
            .and($({ parse: ['x:thing|of', 'y:thing|'] }).when($.the($({ parse: 'x:thing' })).of($({ parse: 'y:thing' }))))
            .and($({ parse: ['the', 'x:thing|in', 'y:thing|'] }).when($.the($({ parse: 'x:thing' })).in($({ parse: 'y:thing' }))))

            .and($.p(['the', 'x:thing']).when($.the($.p('x:thing'))))
            .and($.p(['[', 'x:thing|]']).when('x:thing'))
            .and($.p(['(', 'x:thing|)']).when($.p('x:thing')))
            .and($.p(['x:thing']).when('x:thing'))
            .and($.p('x:thing').when('x:thing'))
            .dump()


        assertEquals(parse($.p(tokenize('if x is a cat then y is a dog')).$, kb), $('y').isa('dog').if($('x').isa('cat')).$)
        assertEquals(parse($({ parse: '( if x is a cat then y is a dog )'.split(' '), }).$, kb), $('y').isa('dog').if($('x').isa('cat')).$)
        assertEquals(parse($({ parse: '( if the cat is a feline then the dog is a canine )'.split(' ') }).$, kb), $.the('dog').isa('canine').if($.the('cat').isa('feline')).$)
        assertEquals(parse($({ parse: '[ capra x:ciao ]'.split(' ') }).$, kb), $(['capra', 'x:ciao']).$)
        assertEquals(parse($({ parse: 'the cat and the dog'.split(' ') }).$, kb), $.the('cat').and($.the('dog')).$)
        assertEquals(parse($({ parse: '( cat and dog ) and meerkat'.split(' ') }).$, kb), $('cat').and('dog').and('meerkat').$)
        assertEquals(parse($({ parse: 'cat and dog and meerkat'.split(' ') }).$, kb), $('cat').and($('dog').and('meerkat')).$)
        assertEquals(parse($({ parse: 'cat and ( dog and meerkat )'.split(' ') }).$, kb), $('cat').and($('dog').and('meerkat')).$)
        assertEquals(parse($({ parse: 'the animal which is a cat'.split(' ') }).$, kb), $.the('animal').which($._.isa('cat')).$)
        assertEquals(parse($({ parse: '( x and y and z ) is a mammal'.split(' ') }).$, kb), $('x').and($('y').and('z')).isa('mammal').$)
        assertEquals(parse($({ parse: 'the cat does eat the mouse'.split(' ') }).$, kb), $.the('cat').does('eat')._($.the('mouse')).$)
        assertEquals(parse($({ parse: 'the cat does eat the mouse in the house'.split(' ') }).$, kb), $.the('cat').does('eat')._($.the('mouse')).in($.the('house')).$)
        
        // assertEquals(parse($({ parse: 'the cat does eat ( the mouse in the house )'.split(' ') }).$, kb), $.the('cat').does('eat')._($.the('mouse').in($.the('house'))).$)
        
        assertEquals(parse($({ parse: 'it when the thing'.split(' ') }).$, kb), $('it').when($.the('thing')).$)
        assertEquals(parse($({ parse: 'cat has high as hunger'.split(' ') }).$, kb), $('cat').has('high').as('hunger').$)
        assertEquals(parse($({ parse: 'cat have high as hunger'.split(' ') }).$, kb), $('cat').has('high').as('hunger').$)
        assertEquals(parse($({ parse: 'the cat is a feline when the sky has blue as color'.split(' ') }).$, kb), $.the('cat').isa('feline').when($.the('sky').has('blue').as('color')).$)
        assertEquals(parse($({ parse: 'the sum of ( 1 and 2 )'.split(' ') }).$, kb), $.the('sum').of($('1').and('2')).$)
        assertEquals(parse($({ parse: 'fib of 4'.split(' ').map(x => parseNumber(x) ?? x) }).$, kb), $.the('fib').of(4).$)
        assertEquals(parse($({ parse: 'cat#1'.split(' ') }).$, kb), $('cat#1').$)


        // lin($('cat').and('dog').$, kb)
        // lin($('cat').and($('dog').and('meerkat')).$, kb)
        // lin($('cat').isa('feline').$, kb)
        const original = $.the('cat').and($.the('dog')).$
        const code = linearize(original, kb)!
        const ast = parse($({ parse: tokenize(code) }).$, kb)
        assertEquals(ast, original)
        // lin($('cat').does('eat')._('mouse').$, kb)

        // const l1 = linearize(o1, kb)!
        // console.log(l1)
        // const a1 = parse($({ parse: tokenize(l1) }).$, kb)
        // console.log(a1)
        const o1 = $.the('cat').does('eat')._($.the('mouse').which($._.does('run'))).$
        const x = 'the cat does eat (the mouse which does run)'
        const ts = tokenize(x)
        const a = parse($({ parse: ts }).$, kb)
        assertEquals(o1, a)
        // console.log(ts)
        // console.log(a)

        // assertEquals(a1, o1)

        // const x = $.the('cat').which($._.does('eat') ).$
        // console.log(x)
        // console.log(linearize(x, kb))

        // console.log(tokenize(''))

        // const a1 = mapNodes($('cat').isa('feline').$, x => $({parse:x}).$ )
        // const a2 = mapNodes(a1, x=>x.type==='generalized' && x['parse']  ? x['parse'] :x )
        // console.log(a1)
        // console.log(a2)
    }
})