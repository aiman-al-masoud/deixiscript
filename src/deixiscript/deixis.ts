import { LLangAst, WorldModel } from "../machines-like-us/types.ts";
import { noun_phrase } from "./ast-types.ts";
import { copulaToHas } from "./copulaToHas.ts";
import { expandModifiers } from "./expandModifiers.ts";
import { parse } from "./parse.ts";
import { wm } from './example-world-model.ts'

console.log(copulaToHas(expandModifiers(parse('the red button')), wm))

// function convert(np: noun_phrase): LLangAst {

//     if (np.modifiers) {
//         throw new Error('noun phrase has modifiers!')
//     }

// }
