// import { getParser } from "../parser/Parser";

// export async function toclausetests() {

//     const tests = [
//         'the color of any button is red',
//         'every button is red',
//         'every button is a button',
//         'the color of any button is the background of the style of the button',
//         'width of any button is width of style of button'
//     ]

//     for (const t of tests) {
//         console.log(t)
//         const clause = await getParser(t).parse().toClause()
//         const stringRepr = clause.toString()
//         console.log({ stringRepr })
//         // const topLevel = clause.topLevel()
//         // console.log({ topLevel })
//         // const ownershipChains = topLevel.map(e => clause.getOwnershipChain(e))
//         // console.log({ ownershipChains })
//         // const ownershipChainsWithNames = ownershipChains.map(e => e.flatMap(e => clause.describe(e)[0]))
//         // console.log({ ownershipChainsWithNames })
//     }

// }

