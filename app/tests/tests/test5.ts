import { getBrain } from "../../src/facade/brain/Brain";

export function test5() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is a button. the color of x is red.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'red';
    return assert1;
}
