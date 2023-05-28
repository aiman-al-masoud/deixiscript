import { parse } from "./parse.ts";
import { expandModifiers } from "./expandModifiers.ts";
import { copulaToHas } from "./copulaToHas.ts";
import { resImpRefs } from "./resImplRefs.ts";
import { useDef } from "./useDef.ts";
import { WorldModel } from "../machines-like-us/types.ts";

const sourceCode = `
the fast player does jump to the enemy.
the player is a sprite.
the player does die.
`

let wm1: WorldModel = [ //TODO: inheritance of roles is broken
    ['player', 'thing'],
    ['speed', 'thing'],
    ['fast', 'speed'],
    ['slow', 'speed'],
    ['player', 'speed', 'speed'],
]

const sentences = sourceCode.split('.').map(x => x.trim()).filter(x => x)
const asts = sentences.map(x => parse(x))
const asts2 = asts.map(x => expandModifiers(x))
const asts3 = asts2.map(x => copulaToHas(x, wm1))
const asts4 = asts3.map(x => resImpRefs(x, wm1))
wm1 = useDef(asts4, wm1)
console.log(wm1)


