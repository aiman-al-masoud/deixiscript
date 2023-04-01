import { getBrain } from "../../src/facade/brain/Brain";

export function test31() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x and y are buttons. x is green and y is red.');
    const res = brain.executeUnwrapped('color of the red button');
    return res.includes('red') && !res.includes('green');
}
