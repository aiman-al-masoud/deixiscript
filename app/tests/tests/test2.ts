import { getBrain } from "../../src/facade/Brain";

export function test2() {
    const brain = getBrain()
    brain.executeUnwrapped('x = 1 + 3 + 4')
    return brain.executeUnwrapped('x').includes(8)
        && brain.executeUnwrapped('the number').includes(8)
}