import { getBrain } from "../../src/facade/Brain";

export function test1() {
    const brain = getBrain()
    brain.execute('x is 1')
    brain.execute('y is 2')
    return brain.executeUnwrapped('every number').every(x => [1, 2].includes(x as number))
}