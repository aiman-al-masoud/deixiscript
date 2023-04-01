import { getBrain } from "../../src/facade/brain/Brain";

export function test8() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is a button. text of x is capra.');
    const assert1 = brain.executeUnwrapped('button')[0].textContent === 'capra';
    return assert1;
}
