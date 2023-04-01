import { getBrain } from "../../src/facade/brain/Brain";

export function test6() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is a button. the background of style of x is green.');
    const assert1 = brain.executeUnwrapped('x')[0].style.background === 'green';
    return assert1;
}
