import { BaseThing } from "../backend/thing/BaseThing"
import { wrap } from "../backend/thing/Thing"

export const thing = wrap({ id: 'thing', object: {} /* object: BaseThing */ })
export const buttonThing = wrap({ id: 'button', object: HTMLButtonElement.prototype })
export const divThing = wrap({ id: 'div', object: HTMLDivElement.prototype })
export const colorThing = wrap({ id: 'color', object: {} })
export const redThing = wrap({ id: 'red', object: 'red' })
export const greenThing = wrap({ id: 'green', object: 'green' })
redThing.set(colorThing)
greenThing.set(colorThing)
export const instructionThing = wrap({ id: 'instruction', object: {} })

export const things = [ //find a better solution to avoid capturing base-buttons in query results
    thing,
    // buttonThing,
    // divThing,
    // instructionThing,
    colorThing,
    redThing,
    greenThing,
]
