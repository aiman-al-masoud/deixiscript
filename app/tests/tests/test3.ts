import { getBrain } from "../../src/facade/Brain";

export function test3() {
    const brain = getBrain()
    brain.execute('x = 1. y =2.')
    const numbers = brain.executeUnwrapped('every number + 3')
    return numbers.includes(4) && numbers.includes(5)
}