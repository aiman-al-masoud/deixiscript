import { BaseThing } from "../backend/thing/BaseThing"
import { wrap } from "../backend/thing/Thing"

export const thing = wrap({ id: 'thing', object: {} /* BaseThing */ })
export const buttonThing = wrap({ id: 'button', object: HTMLButtonElement.prototype })
export const divThing = wrap({ id: 'div', object: HTMLDivElement.prototype })
export const colorThing = wrap({ id: 'color', object: {} })
export const redThing = wrap({ id: 'red', object: 'red' })
redThing.set(colorThing)


export const things = [
    thing,
    buttonThing,
    divThing,
    colorThing,
    redThing,
]
