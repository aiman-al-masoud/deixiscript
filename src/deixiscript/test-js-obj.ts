// import { $ } from "../machines-like-us/exp-builder.ts";
// import { findAll } from "../machines-like-us/findAll.ts";
// import { getStandardKb } from "../machines-like-us/prelude.ts";
// import { WorldModel, isHasSentence } from "../machines-like-us/types.ts";

// const kb = getStandardKb()
// const button1 = { style: { background: 'red' } }

// kb.wm.push(
//     ...$('button#1').has('style#1').as('style').dump(),
//     ...$('style#1').has('background#1').as('background').dump(),
//     ...$('button#1').isa('button').dump(),
//     ...$('style#1').isa('style').dump(),
//     ...$('background#1').has('red').as('value').dump(),
// )

// const registry = {
//     'button#1': button1,
//     'style#1': button1.style,
// }

// function getJsObject(id: string, registry: { [id: string]: object }): object | undefined {
//     return registry[id]
// }

// console.log(getJsObject('button#1', registry))

// const result = findAll($('background#1').has('x:thing').as('value').$, [$('x:thing').$], kb)
// console.log(result[0].get($('x:thing').$))


// console.log(kb.wm)


// function convertToJs(wm: WorldModel, id: string, obj = {} as any) {
//     const hasSens = wm.filter(isHasSentence)
//     const hasSens2 = hasSens.filter(x => x[0] === id)
//     // let x = {}
//     hasSens2.forEach(x => {
//         obj[x[2] as any] = convertToJs(wm, x[1] as any, obj) //{}
//     })
//     return obj
//     // console.log(obj)
// }

// const res = convertToJs(kb.wm, 'button#1')
// console.log(res)
