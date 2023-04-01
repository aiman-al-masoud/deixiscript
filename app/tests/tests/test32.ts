import { getBrain } from "../../src/facade/brain/Brain";

export function test32() {
    const brain = getBrain({ root: document.body });
    brain.executeUnwrapped('x is a red button. y is a button and the color of it is purple.');
    const res = brain.executeUnwrapped('purple button');
    return res.length === 1 && res[0].style.background === 'purple';
}
