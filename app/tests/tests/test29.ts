import { getBrain } from "../../src/facade/brain/Brain";

export function test29() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is 1 and y is 2');
    brain.executeUnwrapped('x adds y');
    return brain.executeUnwrapped('it')[0] === 3;
}
