// import { BaseThing } from "../backend/thing/BaseThing"
import { wrap } from "../backend/thing/Thing"

const things = {
    thing: wrap({ id: 'thing', object: {} /* object: BaseThing */ }),
    button: wrap({ id: 'button', object: HTMLButtonElement.prototype }),
    div: wrap({ id: 'div', object: HTMLDivElement.prototype }),
    color: wrap({ id: 'color', object: {} }),
    red: wrap({ id: 'red', object: 'red' }),
    green: wrap({ id: 'green', object: 'green' }),
    instruction: wrap({ id: 'instruction', object: {} }),
}

things.red.extends(things.color)
things.green.extends(things.color)

export { things }
