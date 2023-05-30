import { parse } from "./parse.ts";
import { expandModifiers } from "./expandModifiers.ts";
import { copulaToHas } from "./copulaToHas.ts";
import { resImpRefs } from "./resImplRefs.ts";
import { useDef } from "./useDef.ts";
import { WorldModel } from "../machines-like-us/types.ts";
import { instructionSort } from "./instructionSort.ts";
import { deixiToJs } from "./deixiToJs.ts";
import { jsAstToJs } from "./jsAstToJs.ts";

const sourceCode = `
the fast player does jump to the enemy.
the player is a sprite.
the player does die.
there is an enemy.
`

let wm: WorldModel = [ //TODO: inheritance of roles is broken
    ['enemy', 'thing'],
    ['player', 'thing'],
    ['speed', 'thing'],
    ['fast', 'speed'],
    ['slow', 'speed'],
    ['player', 'speed', 'speed'],
]

const sentences = sourceCode.split('.').map(x => x.trim()).filter(x => x)
const asts = sentences.map(x => parse(x))
const asts2 = asts.map(x => expandModifiers(x))
const asts3 = asts2.map(x => copulaToHas(x, wm))
const asts4 = asts3.map(x => resImpRefs(x, wm))
wm = useDef(asts4, wm)
const asts5 = instructionSort(wm, asts4)
const jsasts = asts5.map(x => deixiToJs(x))
const jsStmts = jsasts.map(x => jsAstToJs(x))
console.log(asts5)
console.log(jsStmts)

console.log(wm)


