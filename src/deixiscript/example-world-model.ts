import { WorldModel } from "../machines-like-us/types.ts";


export const wm: WorldModel = [
    // conceptual model
    ['background', 'thing'],
    ['button', 'thing'],
    ['color', 'thing'],
    ['button', 'color', 'background'],
    ['red', 'color'],
    // ['foreground', 'thing'],
    // ['button', 'color', 'foreground'],
]